"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import * as z from "zod";
import { YandexButton } from "./yandex-button";
import { handlePhoneChange, handlePhoneKeyDown } from "@/lib/phone";
import { FormInput } from "./form-input";
import { Button } from "./ui";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

// Схема валидации с помощью Zod
const authFormSchema = z.object({
    password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
    phone: z.string().min(18, "Введите корректный номер телефона")
});

export type AuthFormData = z.infer<typeof authFormSchema>;

interface IAuthFormProps {
    className?: string;
}

export const AuthForm = ({ className }: IAuthFormProps): React.JSX.Element => {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset
    } = useForm<AuthFormData>({
        resolver: zodResolver(authFormSchema),
        defaultValues: {
            phone: "+7 "
        }
    });

    const handleFormSubmit = async (data: AuthFormData) => {
        try {
            console.log(data);

            const result = await signIn("credentials", {
                phone: data.phone,
                password: data.password,
                redirect: false
            });

            if (result?.error) {
                toast.error(result.error.toString());
                reset();
                return;
            }

            toast.success("Добро пожаловать!");
            router.push("/profile"); // Ручной редирект после успешного входа
            router.refresh();
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Ошибка при входе");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center">Вход в аккаунт</h2>

                <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                        <FormInput
                            name="phone"
                            type="tel"
                            label="Телефон"
                            required
                            errors={errors}
                            value={field.value}
                            onChange={e => handlePhoneChange(e, field.onChange)}
                            onKeyDown={handlePhoneKeyDown}
                            placeholder="+7 (XXX) XXX-XX-XX"
                        />
                    )}
                />

                <div className="relative">
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <FormInput
                                type={showPassword ? "text" : "password"}
                                label="Пароль"
                                required
                                errors={errors}
                                {...field}
                                placeholder="Не менее 6 символов"
                            />
                        )}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-[42px] text-gray-500 hover:text-gray-700"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <div className="flex justify-end">
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                        Забыли пароль?
                    </Link>
                </div>

                <Button className="w-full py-2" type="submit">
                    Войти
                </Button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-2 bg-white text-sm text-gray-500">Или войдите с помощью</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <YandexButton />
                </div>

                <div className="flex gap-1 items-center justify-center text-center text-sm mt-4">
                    <>
                        <p>Нет аккаунта?</p>
                        <Link href="/register" className="text-blue-600 hover:underline">
                            Зарегистрироваться
                        </Link>
                    </>
                </div>
            </form>
        </div>
    );
};
