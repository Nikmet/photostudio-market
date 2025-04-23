"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { handlePhoneChange, handlePhoneKeyDown } from "@/lib/phone";
import toast from "react-hot-toast";
import { FormInput } from "../inputs/form-input";
import { AdminCheckbox } from "../admin-components/admin-checkbox";

const registerFormSchema = z
    .object({
        fullName: z.string().min(1, "Поле обязательно"),
        phone: z.string().min(18, "Введите корректный номер телефона"),
        email: z.string().email("Введите корректный email"),
        password: z
            .string()
            .min(6, "Пароль должен содержать минимум 6 символов")
            .regex(/[a-zа-я]/, "Пароль должен содержать хотя бы одну букву")
            .regex(/\d/, "Пароль должен содержать хотя бы одну цифру"),
        confirmPassword: z.string().min(6, "Подтвердите пароль"),
        agreeToTerms: z.boolean().refine(val => val, {
            message: "Необходимо согласиться с условиями"
        })
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Пароли не совпадают",
        path: ["confirmPassword"]
    });

export type RegisterFormData = z.infer<typeof registerFormSchema>;
type PasswordStrength = "weak" | "medium" | "strong";

interface IRegisterFormProps {
    className?: string;
    onSubmit: (data: RegisterFormData) => void;
}

export const RegisterForm = ({ onSubmit, className }: IRegisterFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>("weak");
    const [passwordSuggestions, setPasswordSuggestions] = useState<string[]>([]);

    const {
        handleSubmit,
        formState: { errors },
        control,
        watch
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            agreeToTerms: false
        }
    });

    const password = watch("password");

    useEffect(() => {
        if (!password) {
            setPasswordStrength("weak");
            setPasswordSuggestions([]);
            return;
        }

        const suggestions = [];
        let strength: PasswordStrength = "weak";

        if (password.length < 8) {
            suggestions.push("Используйте не менее 8 символов");
        }

        const hasNumbers = /\d/.test(password);
        if (!hasNumbers) {
            suggestions.push("Добавьте хотя бы одну цифру");
        }

        const hasLetters = /[a-zA-Zа-яА-Я]/.test(password);
        if (!hasLetters) {
            suggestions.push("Добавьте хотя бы одну букву");
        }

        const hasUpperCase = /[A-ZА-Я]/.test(password);
        if (!hasUpperCase) {
            suggestions.push("Добавьте заглавную букву для усиления пароля");
        }

        if (password.length >= 8 && hasNumbers && hasLetters) {
            strength = hasUpperCase ? "strong" : "medium";
        } else if (password.length >= 8 && (hasNumbers || hasLetters)) {
            strength = "medium";
        } else {
            strength = "weak";
        }

        setPasswordStrength(strength);
        setPasswordSuggestions(suggestions);
    }, [password]);

    const handleFormSubmit = async (data: RegisterFormData) => {
        if (passwordStrength === "weak") {
            toast.error("Пароль не надежный, придумайте пароль хотя бы средней сложности!");
            return;
        }
        onSubmit(data);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const strengthColors = {
        weak: "bg-red-500 dark:bg-red-400",
        medium: "bg-yellow-500 dark:bg-yellow-400",
        strong: "bg-green-500 dark:bg-green-400"
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Регистрация</h2>

                <Controller
                    name="fullName"
                    control={control}
                    render={({ field }) => <FormInput type="text" label="ФИО" required errors={errors} {...field} />}
                />

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
                        className="absolute right-3 top-[42px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {password && (
                    <div className="mt-1">
                        <div className="flex gap-1 mb-1">
                            {[1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    className={`h-1 flex-1 rounded-full ${
                                        i <= (passwordStrength === "weak" ? 1 : passwordStrength === "medium" ? 2 : 3)
                                            ? strengthColors[passwordStrength]
                                            : "bg-gray-200 dark:bg-gray-600"
                                    }`}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                            Сложность:{" "}
                            <span
                                className={`font-medium ${
                                    passwordStrength === "weak"
                                        ? "text-red-500 dark:text-red-400"
                                        : passwordStrength === "medium"
                                        ? "text-yellow-500 dark:text-yellow-400"
                                        : "text-green-500 dark:text-green-400"
                                }`}
                            >
                                {passwordStrength === "weak"
                                    ? "Слабая"
                                    : passwordStrength === "medium"
                                    ? "Средняя"
                                    : "Сильная"}
                            </span>
                        </p>

                        {passwordSuggestions.length > 0 && (
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                <p>Как улучшить пароль:</p>
                                <ul className="list-disc pl-5">
                                    {passwordSuggestions.map((suggestion, index) => (
                                        <li key={index}>{suggestion}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <div className="relative">
                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                            <FormInput
                                type={showPassword ? "text" : "password"}
                                label="Подтвердите пароль"
                                required
                                errors={errors}
                                {...field}
                                placeholder="Повторите пароль"
                            />
                        )}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-[42px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <div className="mt-4">
                    <Controller
                        name="agreeToTerms"
                        control={control}
                        render={({ field }) => (
                            <AdminCheckbox
                                {...field}
                                checked={field.value}
                                onChange={field.onChange}
                                label={
                                    <span className="text-gray-800 dark:text-gray-300">
                                        Я соглашаюсь с{" "}
                                        <Link
                                            href="/privacy-policy"
                                            className="text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            политикой конфиденциальности
                                        </Link>{" "}
                                        и{" "}
                                        <Link
                                            href="/terms-of-service"
                                            className="text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            условиями использования
                                        </Link>
                                    </span>
                                }
                            />
                        )}
                    />
                    {errors.agreeToTerms && (
                        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.agreeToTerms.message}</p>
                    )}
                </div>

                <Button className="w-full py-2" type="submit">
                    Зарегистрироваться
                </Button>

                <div className="flex gap-1 items-center justify-center text-center text-sm mt-4">
                    <p className="text-gray-800 dark:text-gray-300">Есть аккаунт?</p>
                    <Link href="/login" className="text-blue-600 hover:underline dark:text-blue-400">
                        Войти
                    </Link>
                </div>
            </form>
        </div>
    );
};
