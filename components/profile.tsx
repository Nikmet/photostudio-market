"use client";

import { useSession } from "next-auth/react";
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

// Схема валидации
const profileSchema = z.object({
    name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
    email: z.string().email("Введите корректный email"),
    phone: z.string().optional()
});

type ProfileFormData = z.infer<typeof profileSchema>;

export interface IProfileProps {
    className?: string;
    orders: IOrderProps[];
}

export const Profile = ({ orders, className }: IProfileProps) => {
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
        // Здесь логика обновления профиля
        console.log("Обновленные данные:", data);
        // Можно добавить вызов API для сохранения изменений
    };

    if (!session) {
        return <div className={className}>Необходимо авторизоваться</div>;
    }

    return (
        <div className={cn(className, "p-10")}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-10">
                <img src={session.user.image} alt="" className="w-[300px] h-[300px] rounded-full" />
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
                    <Button type="button" onClick={() => signOut({ callbackUrl: "/" })}>
                        Выйти
                    </Button>
                </div>
                {orders.length > 0 && (
                    <div className="mb-2">
                        <h2 className="text-2xl mb-2">Заказы клиента</h2>
                        <ClientTable orders={orders} />
                    </div>
                )}
            </form>
        </div>
    );
};
