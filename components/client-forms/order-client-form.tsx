"use client";

import { FormTextarea } from "../inputs/form-textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import React from "react";
import { Cart, Product, ProductItem } from "@prisma/client";
import { FormInput } from "../inputs/form-input";

const orderFormSchema = z.object({
    comment: z.string().optional(),
    paymentMethod: z.enum(["online", "cash"]).default("online"),
    promo_code: z.string().optional()
});

export type OrderClientFormValues = z.infer<typeof orderFormSchema>;

export interface IOrderClientFormProps {
    className?: string;
    onSubmit: (data: OrderClientFormValues, userId: string) => void;
}

type CartWithItems = Cart & {
    items: (ProductItem & { product: Product })[];
};

export const OrderClientForm = ({ onSubmit, className }: IOrderClientFormProps): React.JSX.Element => {
    const {
        control,
        formState: { errors, isSubmitting },
        handleSubmit,
        watch,
        setValue
    } = useForm<OrderClientFormValues>({
        resolver: zodResolver(orderFormSchema),
        defaultValues: {
            comment: "",
            paymentMethod: "online"
        }
    });

    const [cart, setCart] = React.useState<CartWithItems | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [discount, setDiscount] = React.useState<number | null>(null);
    const [promoError, setPromoError] = React.useState<string | null>(null);
    const [isCheckingPromo, setIsCheckingPromo] = React.useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);

    const session = useSession();

    const payment_method = watch("paymentMethod");
    const promo_code = watch("promo_code");

    React.useEffect(() => {
        const fetchCart = async () => {
            if (!session.data?.user?.id) return;

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch("/api/cart/get-user-cart", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: session.data.user.id
                    })
                });

                if (!response.ok) {
                    throw new Error("Не удалось загрузить корзину");
                }

                const data = await response.json();
                setCart(data);
            } catch (err) {
                console.error("Ошибка при загрузке корзины:", err);
                setError("Не удалось загрузить корзину. Пожалуйста, попробуйте позже.");
                setCart(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCart();
    }, [session.data?.user?.id]);

    const handleSubmitForm = async (data: OrderClientFormValues) => {
        if (!session.data?.user?.id) return;

        if (data.paymentMethod === "online") {
            setIsProcessingPayment(true);
        }

        try {
            await onSubmit(data, session.data.user.id);
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const handleApplyPromoCode = async () => {
        if (!promo_code || !session.data?.user?.id) return;

        setIsCheckingPromo(true);
        setPromoError(null);

        try {
            const response = await fetch("/api/promo/check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    code: promo_code
                })
            });

            if (!response.ok) {
                throw new Error("Промокод недействителен или истек срок действия");
            }

            const data = await response.json();
            setDiscount(data.discount);
        } catch (err) {
            console.error("Ошибка при проверке промокода:", err);
            setPromoError(err instanceof Error ? err.message : "Не удалось применить промокод");
            setDiscount(null);
        } finally {
            setIsCheckingPromo(false);
        }
    };

    const handleRemovePromoCode = () => {
        setValue("promo_code", "");
        setDiscount(null);
        setPromoError(null);
    };

    if (isLoading) {
        return (
            <div className={`flex justify-center items-center h-64 ${className}`}>
                <div className="loader dark:text-white"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className={`bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-700 p-4 ${className}`}
            >
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg
                            className="h-5 w-5 text-red-500 dark:text-red-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    const calculateTotal = () => {
        if (!cart) return 0;

        const subtotal = cart.items.reduce((sum, item) => sum + item.count * item.product.price, 0);

        if (discount) {
            return subtotal - (subtotal * discount) / 100;
        }

        return subtotal;
    };

    const total = calculateTotal();
    const subtotal = cart?.items.reduce((sum, item) => sum + item.count * item.product.price, 0) || 0;

    return (
        <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden ${className}`}>
            {/* Заголовок */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <h1 className="text-2xl font-bold">Оформление заказа</h1>
            </div>

            {/* Оверлей загрузки для ЮКассы */}
            {isProcessingPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Перенаправляем на страницу оплаты...
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Пожалуйста, подождите, идет подготовка платежа в ЮКасса.
                        </p>
                    </div>
                </div>
            )}

            {/* Содержимое */}
            <div className="p-6 space-y-6">
                {cart?.items && cart.items.length > 0 ? (
                    <>
                        {/* Товары в корзине */}
                        <div className="pb-4">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Ваши товары</h2>
                            <ul className="space-y-4">
                                {cart.items.map(item => (
                                    <li
                                        key={`${item.id}-${item.productId}`}
                                        className={`flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                                    {item.product.itemName}
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                    {item.count} шт. × {item.product.price.toLocaleString()} ₽
                                                </p>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                                            {(item.count * item.product.price).toLocaleString()} ₽
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                                {discount && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-300">Скидка по промокоду:</span>
                                        <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                                            -{((subtotal * discount) / 100).toLocaleString()} ₽ ({discount}%)
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300">Итого:</span>
                                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {total.toLocaleString()} ₽
                                    </span>
                                </div>
                                {discount && (
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        <span>Без скидки: </span>
                                        <span className="line-through">{subtotal.toLocaleString()} ₽</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Форма комментария и оплаты */}
                        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
                            <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 mb-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-5 w-5 text-yellow-400 dark:text-yellow-500"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                            Обратите внимание: окончательная стоимость может измениться после оценки
                                            сложности дизайна и работ.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Способ оплаты</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Controller
                                        name="paymentMethod"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <label
                                                    className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                                                        field.value === "online"
                                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-600"
                                                            : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        className="mt-1 h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500"
                                                        checked={field.value === "online"}
                                                        onChange={() => field.onChange("online")}
                                                    />
                                                    <div className="ml-3">
                                                        <span className="block font-medium text-gray-900 dark:text-gray-100">
                                                            Онлайн-оплата
                                                        </span>
                                                        <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                            Безопасная оплата картой через платежный шлюз
                                                        </span>
                                                    </div>
                                                </label>
                                                <label
                                                    className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                                                        field.value === "cash"
                                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-600"
                                                            : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        className="mt-1 h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500"
                                                        checked={field.value === "cash"}
                                                        onChange={() => field.onChange("cash")}
                                                    />
                                                    <div className="ml-3">
                                                        <span className="block font-medium text-gray-900 dark:text-gray-100">
                                                            При получении
                                                        </span>
                                                        <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                            Наличными или картой при получении заказа
                                                        </span>
                                                    </div>
                                                </label>
                                            </>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-end gap-2">
                                    <Controller
                                        control={control}
                                        name="promo_code"
                                        render={({ field }) => (
                                            <FormInput
                                                type="text"
                                                label="Промокод"
                                                {...field}
                                                errors={errors}
                                                className="flex-1"
                                            />
                                        )}
                                    />
                                    {discount ? (
                                        <button
                                            type="button"
                                            onClick={handleRemovePromoCode}
                                            className="h-10 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors"
                                            disabled={isCheckingPromo}
                                        >
                                            Удалить
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleApplyPromoCode}
                                            className="h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                                            disabled={isCheckingPromo || !promo_code}
                                        >
                                            {isCheckingPromo ? "Проверка..." : "Применить"}
                                        </button>
                                    )}
                                </div>
                                {promoError && <p className="text-sm text-red-600 dark:text-red-400">{promoError}</p>}
                                {discount && (
                                    <p className="text-sm text-green-600 dark:text-green-400">
                                        Промокод применен! Ваша скидка: {discount}%
                                    </p>
                                )}
                            </div>

                            <Controller
                                name="comment"
                                control={control}
                                render={({ field }) => (
                                    <FormTextarea
                                        label="Комментарий к заказу"
                                        placeholder="Укажите дополнительные пожелания, особенности или контакт для связи..."
                                        errors={errors}
                                        {...field}
                                        className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:text-white"
                                    />
                                )}
                            />

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                disabled={isSubmitting || isProcessingPayment}
                            >
                                {isProcessingPayment ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Подготовка платежа...
                                    </span>
                                ) : payment_method == "cash" ? (
                                    "Создать заказ"
                                ) : (
                                    "Оплатить"
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">Корзина пуста</h3>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                            Добавьте товары в корзину для оформления заказа
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
