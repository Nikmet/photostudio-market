"use client";

import { Controller, useForm } from "react-hook-form";
import { formSchemaOrders, FormValuesOrders } from "./schema";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminSelect } from "@/components/admin-select";
import { orderStatus } from "@/@types/enums";
import { FormTextarea } from "@/components/form-textarea";
import { Button } from "@/components/ui";
import { FormInput } from "@/components/form-input";

export interface IOrderFormProps {
    defaultValues?: FormValuesOrders;
    onSubmit: (data: FormValuesOrders) => void;
    className?: string;
}

export const OrderForm = ({ onSubmit, defaultValues, className }: IOrderFormProps): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormValuesOrders>({
        resolver: zodResolver(formSchemaOrders),
        defaultValues: defaultValues
    });

    const submitAction = (data: FormValuesOrders) => {
        onSubmit(data);
        toast.success(`Заказ для ${data.userName} успешно сохранен!`);
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(submitAction)}>
                <div className="flex gap-5">
                    <div className="flex flex-col gap-2 w-[500px]">
                        <h3>Информация о клиенте</h3>
                        {/* Сделать выбором как в 1с */}
                        <Controller
                            name="userName"
                            control={control}
                            render={({ field }) => (
                                <FormInput type="text" label="ФИО клиента" {...field} errors={errors} required />
                            )}
                        />
                        <Controller
                            name="userEmail"
                            control={control}
                            render={({ field }) => (
                                <FormInput type="text" label="Электронная почта" {...field} errors={errors} required />
                            )}
                        />
                        <Controller
                            name="userPhone"
                            control={control}
                            render={({ field }) => (
                                <FormInput type="text" label="Номер телефона" {...field} errors={errors} required />
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-[500px]">
                        <h3>Статусы</h3>
                        <AdminSelect
                            name="order_status"
                            value={watch("order_status")}
                            onChange={value => setValue("order_status", value)}
                            label={"Статус заказа"}
                            items={orderStatus}
                            defaultValue={defaultValues?.order_status}
                            errors={errors}
                        />
                        <AdminSelect
                            name="order_payment_status"
                            value={watch("order_payment_status")}
                            onChange={value => setValue("order_payment_status", value)}
                            label={"Статус оплаты"}
                            items={orderStatus}
                            defaultValue={defaultValues?.order_status}
                            errors={errors}
                        />
                    </div>
                </div>
                <Controller
                    name="comment"
                    control={control}
                    render={({ field }) => (
                        <FormTextarea className="w-[500px] mt-4" label="Комментарий" errors={errors} {...field} />
                    )}
                />
            </form>
            <Button type="submit" className="mt-4">
                Сохранить
            </Button>
        </div>
    );
};
