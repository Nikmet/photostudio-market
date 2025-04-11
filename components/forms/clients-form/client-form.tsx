"use client";

import { Controller, useForm } from "react-hook-form";
import { formSchemaClients, FormValuesClients } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Button } from "@/components/ui";
import { FormInput } from "@/components/form-input";
import { useEffect } from "react";
import { formatPhoneNumber, handlePhoneChange, handlePhoneKeyDown } from "@/lib/phone";
import { ClientTable } from "@/components/client-table";
import { OrderPaymentStatus, OrderStatus } from "@prisma/client";
import { ImageInput } from "@/components/image-input";

export interface IOrderProps {
    id: string;
    payment_status: OrderPaymentStatus;
    createdAt: string;
    totalAmount: number;
    status: OrderStatus;
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

    console.log(defaultValues);

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(submitAction)} className="flex gap-2">
                <Controller
                    name="photo"
                    control={control}
                    render={({ field }) => (
                        <ImageInput
                            {...field}
                            label="Изображение"
                            errors={errors}
                            onChange={file => field.onChange(file)} // Передаем файл в форму
                        />
                    )}
                />
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
