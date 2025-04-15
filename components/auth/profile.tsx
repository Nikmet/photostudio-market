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
import { ArrowRight, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { VerificationCodeInput } from "./virification-code-input";
import { FormInput } from "../inputs/form-input";

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
                <div className="w-[2px] h-[300px] bg-slate-400"></div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl">Подтверждение аккаунта</h2>
                    {verifiedState && (
                        <div className="flex flex-col gap-2">
                            <p className="flex items-center gap-2 bg-green-100 rounded-md p-2">
                                <Check /> <span>Ваш аккаунт подтвержден.</span>
                            </p>
                            <p>*Вы можете использовать все возможности сайта.</p>
                        </div>
                    )}
                    {!verifiedState && (
                        <div className="flex flex-col gap-2 w-[300px]">
                            {!sendingCode && (
                                <>
                                    {" "}
                                    <p className="flex items-center gap-2 bg-red-100 rounded-md p-2">
                                        <X /> <span>Ваш аккаунт не подтвержден.</span>
                                    </p>
                                    <Button type="button" variant={"outline"} onClick={createNewCode}>
                                        Отправить код подтверждения
                                    </Button>
                                </>
                            )}
                            {sendingCode && (
                                <div className="flex flex-col gap-2  w-[300px]">
                                    <VerificationCodeInput onComplete={onCodeSubmit} />
                                </div>
                            )}
                        </div>
                    )}
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
