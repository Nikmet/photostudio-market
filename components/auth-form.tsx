"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

// Определяем интерфейс для пропсов
export interface IAuthFormProps {
    className?: string;
    onSubmit: (data: AuthFormData) => Promise<{ error?: string }>;
}

// Схема валидации с помощью Zod
const authFormSchema = z.object({
    email: z.string().email("Введите корректный email"),
    password: z.string().min(4, "Пароль должен содержать минимум 6 символов")
});

// Тип для данных формы на основе схемы
export type AuthFormData = z.infer<typeof authFormSchema>;

export const AuthForm = ({ className, onSubmit }: IAuthFormProps): React.JSX.Element => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<AuthFormData>({
        resolver: zodResolver(authFormSchema)
    });

    const handleFormSubmit = async (data: AuthFormData) => {
        const result = await onSubmit(data);
        if (result?.error) {
            toast.error(result.error);
        }
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 w-[300px]">
                <div>
                    <label htmlFor="email" className="block mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register("email")}
                        className="w-full p-2 border rounded"
                        disabled={isSubmitting}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block mb-1">
                        Пароль
                    </label>
                    <input
                        id="password"
                        type="password"
                        {...register("password")}
                        className="w-full p-2 border rounded"
                        disabled={isSubmitting}
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                    {isSubmitting ? "Вход..." : "Войти"}
                </button>
            </form>
        </div>
    );
};
