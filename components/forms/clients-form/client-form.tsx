"use client";

import { Controller, useForm } from "react-hook-form";
import { formSchemaClients, FormValuesClients } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Button } from "@/components/ui";
import { FormInput } from "@/components/form-input";
import { useEffect } from "react";
import { formatPhoneNumber } from "@/lib/phone";
import { ClientTable } from "@/components/client-table";
import { OrderPaymentStatus, OrderStatus } from "@prisma/client";

export interface IOrderProps {
    id: string,
    payment_status: OrderPaymentStatus,
    createdAt: string,
    totalAmount: number,
    status: OrderStatus
}

export interface IClientFormProps {
    defaultValues?: FormValuesClients;
    onSubmit: (data: FormValuesClients) => void;
    orders: IOrderProps[];
    className?: string;
}

export const ClientForm = ({ onSubmit, defaultValues, orders, className }: IClientFormProps): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<FormValuesClients>({
        resolver: zodResolver(formSchemaClients),
        defaultValues: {
            ...defaultValues,
            phone: defaultValues?.phone ? formatPhoneNumber(defaultValues.phone) : "+7 "
        }
    });

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

    const submitAction = async (data: FormValuesClients) => {
        const res = await fetch(`isRegistered/${data.email}`);
        const isRegistered = await res.json();

        if (isRegistered && !defaultValues) {
            toast.error("Пользователь с такой почтой уже зарегистрирован!");
            return;
        }
        onSubmit(data);
        toast.success(`Клиент "${data.fullName}" успешно сохранен!`);
    };

    // Инициализация значения телефона при монтировании
    useEffect(() => {
        if (!defaultValues?.phone) {
            setValue("phone", "+7 ");
        }
    }, [defaultValues, setValue]);

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(submitAction)} className="flex flex-col gap-2">
                <div className="flex flex-col w-[400px] gap-2">
                    <Controller
                        name="fullName"
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
                </div>
                {orders.length > 0 && (
                    <div className="mb-2">
                        <h2 className="text-2xl mb-2">Заказы клиента</h2>
                        <ClientTable orders={orders} />
                    </div>
                )}
                <div className="flex justify-end">
                    <Button type="submit" className="w-[300px]">
                        {defaultValues ? "Сохранить" : "Создать"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
