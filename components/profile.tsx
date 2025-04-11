"use client";

import { signIn, useSession } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "./ui";
import { signOut } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React from "react";
import { FormInput } from "./form-input";
import { ClientTable } from "./client-table";
import { IOrderProps } from "./forms/clients-form/client-form";
import { formatPhoneNumber } from "@/lib/phone";
import { cn } from "@/lib";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { User } from "@prisma/client";

// Схема валидации
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

export const Profile = ({ onSubmitAction, userPassword, orders, className }: IProfileProps) => {
    const { data: session } = useSession();

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

    // Обновляем форму при изменении сессии
    React.useEffect(() => {
        console.log(session);

        if (session) {
            reset({
                name: session.user?.name || "",
                email: session.user?.email || "",
                phone: session.user?.phone || ""
            });
        }
    }, [session, reset]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
        const input = e.target.value;

        // Если пытаются удалить +7, игнорируем
        if (input.length < 3) {
            onChange("+7 ");
            return;
        }

        // Если +7 был изменен, восстанавливаем
        if (!input.startsWith("+7 ")) {
            const digits = input.replace(/\D/g, "").slice(0, 10);
            onChange(formatPhoneNumber("+7 " + digits));
            return;
        }

        const formatted = formatPhoneNumber(input);
        onChange(formatted);
    };

    const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Запрещаем удаление +7 с помощью Backspace или Delete
        const target = e.target as HTMLInputElement;
        if ((e.key === "Backspace" || e.key === "Delete") && target.selectionStart && target.selectionStart <= 3) {
            e.preventDefault();
        }
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
        <div className={cn(className, "p-10")}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-10 mb-10">
                <img
                    src={session.user.photo ?? "/avatar.png"}
                    alt="Фотография пользователя"
                    className="w-[300px] h-[300px] rounded-full border-2 border-gray-300"
                />
                <div className="flex flex-col w-[400px] gap-2">
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
                    <div className="flex gap-2 mt-4">
                        <Button type="submit">Сохранить изменения</Button>
                        <Button type="button" onClick={() => signOut({ callbackUrl: "/" })} variant={"outline"}>
                            Выйти из аккаунта
                        </Button>
                    </div>
                </div>
            </form>
            {orders.length > 0 && (
                <div className="mb-2">
                    <h2 className="text-2xl mb-2">Ваши заказы</h2>
                    <ClientTable orders={orders} />
                </div>
            )}
            {orders.length == 0 && (
                <div className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-300 p-5 rounded-md">
                    <h2 className="text-2xl">У вас нет заказов</h2>
                    <p>Вы можете сделать заказ, перейдя в каталог.</p>
                    <Link
                        href="/"
                        className="text-blue-500 hover:gap-3 flex items-center gap-1 transition-all duration-100"
                    >
                        <span>Перейти к выбору</span> <ArrowRight />
                    </Link>
                </div>
            )}
        </div>
    );
};
