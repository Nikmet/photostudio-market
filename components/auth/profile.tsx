"use client";

import { signIn, useSession } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui";
import { signOut } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React from "react";
import { ClientTable } from "../admin-components/client-table";
import { IOrderProps } from "../admin-forms/clients-form/client-form";
import { handlePhoneChange, handlePhoneKeyDown } from "@/lib/phone";
import { cn } from "@/lib";
import Link from "next/link";
import { ArrowRight, Check, User, X } from "lucide-react";
import toast from "react-hot-toast";
import { VerificationCodeInput } from "./virification-code-input";
import { FormInput } from "../inputs/form-input";

const profileSchema = z.object({
    name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
    email: z.string().email("Введите корректный email"),
    phone: z.string().optional()
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export interface IProfileProps {
    className?: string;
    orders: IOrderProps[];
    verified: boolean | undefined;
    onSubmitAction: (data: ProfileFormData) => void;
    userPassword?: string;
}

export const Profile = ({ onSubmitAction, userPassword, orders, verified, className }: IProfileProps) => {
    const { data: session } = useSession();
    const [sendingCode, setSendingCode] = React.useState(false);
    const [verifiedState, setVerifiedState] = React.useState(verified);

    const {
        handleSubmit,
        formState: { errors },
        reset,
        control
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: session?.user?.name || "",
            email: session?.user?.email || "",
            phone: session?.user?.phone || ""
        }
    });

    React.useEffect(() => {
        if (session) {
            reset({
                name: session.user?.name || "",
                email: session.user?.email || "",
                phone: session.user?.phone || ""
            });
        }
    }, [session, reset]);

    const createNewCode = async () => {
        const data = await fetch("/api/verification/newCode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                phone: session?.user?.phone
            })
        });

        if (data.status === 200) {
            toast.success("Код отправлен, проверьте ваш телефон");
            setSendingCode(true);
        } else {
            toast.error("Произошла ошибка. Попробуйте позже");
        }
    };

    const onCodeSubmit = async (code: string) => {
        const data = await fetch("/api/verification/verified", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                phone: session?.user?.phone,
                code
            })
        });

        if (data.status === 200) {
            toast.success("Аккаунт подтвержден");
            setSendingCode(false);
            setVerifiedState(true);
        } else {
            toast.error("Произошла ошибка. Попробуйте позже");
        }
        setSendingCode(false);
    };

    const onSubmit = async (data: ProfileFormData) => {
        await onSubmitAction(data);
        signIn("credentials", {
            phone: data.phone,
            password: userPassword,
            redirect: false
        });

        toast.success("Профиль успешно обновлен!");
    };

    if (!session) {
        return <div className={className}>Необходимо авторизоваться</div>;
    }

    return (
        <div className={cn(className, "p-4 sm:p-6 md:p-8 xl:p-10")}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-6 xl:gap-10 mb-8 md:mb-10">
                {/* Аватар */}
                <div className="flex justify-center md:justify-start">
                    <img
                        src={session.user.photo ?? "/avatar.png"}
                        alt="Фотография пользователя"
                        className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[200px] md:h-[200px] xl:w-[250px] xl:h-[250px] rounded-full border-2 border-gray-300 mx-auto md:mx-0"
                    />
                </div>

                {/* Основная форма */}
                <div className="flex flex-col w-full md:w-[250px] xl:w-[300px] gap-3 md:gap-4">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <FormInput type="text" label="ФИО" required errors={errors} {...field} />
                        )}
                    />
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <FormInput
                                type="tel"
                                name={field.name}
                                label="Телефон"
                                required
                                errors={errors}
                                value={field.value}
                                onChange={e => handlePhoneChange(e, field.onChange)}
                                onKeyDown={handlePhoneKeyDown}
                                onFocus={e => {
                                    if (!e.target.value) {
                                        field.onChange("+7 ");
                                    }
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <FormInput type="email" label="Эл. Почта" required errors={errors} {...field} />
                        )}
                    />
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Button type="submit" className="w-full sm:w-auto">
                            Сохранить изменения
                        </Button>
                        <Button
                            type="button"
                            onClick={() => signOut({ callbackUrl: "/" })}
                            variant={"outline"}
                            className="w-full sm:w-auto dark:border-white"
                        >
                            Выйти из аккаунта
                        </Button>
                    </div>
                </div>

                {/* Разделитель */}
                <div className="hidden md:block w-[1px] h-auto bg-gray-300 mx-4 xl:mx-6"></div>

                {/* Подтверждение аккаунта */}
                <div className="flex flex-col gap-3 md:gap-4 mt-6 md:mt-0 md:w-[250px] xl:w-[300px]">
                    <h2 className="text-lg sm:text-xl md:text-xl xl:text-2xl">Подтверждение аккаунта</h2>
                    {verifiedState && (
                        <div className="flex flex-col gap-2">
                            {session.user.role === "USER" && (
                                <>
                                    <p className="flex items-center gap-2 bg-green-100 dark:bg-green-900 rounded-md p-2 text-sm sm:text-base">
                                        <Check size={16} className="flex-shrink-0" />{" "}
                                        <span>Ваш аккаунт подтвержден.</span>
                                    </p>
                                    <p className="text-sm sm:text-base">
                                        *Вы можете использовать все возможности сайта.
                                    </p>
                                </>
                            )}
                            {session.user.role === "ADMIN" && (
                                <p className="flex items-center gap-2 bg-green-100 dark:bg-green-900 rounded-md p-2 text-sm sm:text-base">
                                    <User size={16} className="flex-shrink-0" />{" "}
                                    <span>Вы являетесь администратором</span>
                                </p>
                            )}
                        </div>
                    )}
                    {!verifiedState && (
                        <div className="flex flex-col gap-3 w-full">
                            {!sendingCode && (
                                <>
                                    <p className="flex items-center gap-2 bg-red-100 dark:bg-red-800 rounded-md p-2 text-sm sm:text-base">
                                        <X size={16} className="flex-shrink-0" />{" "}
                                        <span>Ваш аккаунт не подтвержден.</span>
                                    </p>
                                    <Button
                                        type="button"
                                        variant={"outline"}
                                        onClick={createNewCode}
                                        className="w-full sm:w-auto dark:border-white"
                                    >
                                        Отправить код подтверждения
                                    </Button>
                                </>
                            )}
                            {sendingCode && (
                                <div className="flex flex-col gap-3 w-full">
                                    <VerificationCodeInput onComplete={onCodeSubmit} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </form>

            {/* Секция заказов */}
            {orders.length > 0 && (
                <div className="mb-4 md:mb-6 mt-8 md:mt-10">
                    <h2 className="text-lg sm:text-xl md:text-xl xl:text-2xl mb-3 md:mb-4">Ваши заказы</h2>
                    <div className="overflow-x-auto">
                        <ClientTable orders={orders} />
                    </div>
                </div>
            )}

            {orders.length == 0 && (
                <div className="flex flex-col items-center gap-3 border-2 border-dashed border-gray-300 p-4 sm:p-5 rounded-md mt-8 md:mt-10">
                    <h2 className="text-lg sm:text-xl md:text-xl xl:text-2xl text-center">У вас нет заказов</h2>
                    <p className="text-center text-sm sm:text-base">Вы можете сделать заказ, перейдя в каталог.</p>
                    <Link
                        href="/"
                        className="text-blue-500 hover:gap-3 flex items-center gap-1 transition-all duration-100 text-sm sm:text-base mt-2"
                    >
                        <span>Перейти к выбору</span> <ArrowRight size={16} />
                    </Link>
                </div>
            )}
        </div>
    );
};
