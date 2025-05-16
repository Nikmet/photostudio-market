"use client";

import { Controller, useForm } from "react-hook-form";
import { formSchemaOrders, FormValuesOrders } from "./schema";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminSelect } from "@/components/admin-components/admin-select";
import { orderPaymentStatus, orderStatus } from "@/@types/enums";
import { Button } from "@/components/ui";
import React from "react";
import { SelectedUserWindow } from "@/components/admin-components/selected-user-window";
import { User } from "@prisma/client";
import { AppWindow } from "lucide-react";
import { OrdersTable, ProductItemWithProduct } from "@/components/admin-components/orders-table";
import { FormInput } from "@/components/inputs/form-input";
import { FormTextarea } from "@/components/inputs/form-textarea";
import { UseCloseTabOnSubmit } from "@/hooks/use-close-tab-on-submit";

export interface IOrderFormProps {
    defaultValues?: FormValuesOrders;
    onSubmit: (data: FormValuesOrders, products: ProductItemWithProduct[]) => void;
    className?: string;
    productsProp: ProductItemWithProduct[];
    orderTotal: number;
    id: string;
    href: string;
}

export const OrderForm = ({
    onSubmit,
    defaultValues,
    productsProp,
    orderTotal,
    href,
    id,
    className
}: IOrderFormProps): React.JSX.Element => {
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
    const [usersForTable, setUsersForTable] = React.useState<User[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [addWindow, setAddWindow] = React.useState(false);
    const [products, setProducts] = React.useState<ProductItemWithProduct[]>(productsProp);

    const { closeTab } = UseCloseTabOnSubmit();

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/users");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    };

    const handleAdd = async () => {
        setLoading(true);
        const users: User[] = await fetchUsers();
        setUsersForTable(users);
        setLoading(false);
        setAddWindow(true);
    };

    const handleAddUser = (user: User) => {
        setValue("userEmail", user.email);
        setValue("userName", user.fullName);
        setValue("userPhone", user.phone);
        setAddWindow(false);
    };

    const submitAction = (data: FormValuesOrders) => {
        onSubmit(data, products);
        closeTab(id, href, "Заказы");
        toast.success(`Заказ для ${data.userName} успешно сохранен!`);
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(submitAction)}>
                <div className="flex gap-5">
                    <div className="flex flex-col gap-2 w-[500px]">
                        <h3>Информация о клиенте</h3>
                        <div className="flex gap-2">
                            <Controller
                                name="userName"
                                control={control}
                                render={({ field }) => (
                                    <FormInput
                                        type="text"
                                        label="ФИО клиента"
                                        {...field}
                                        errors={errors}
                                        required
                                        className="w-full"
                                        disabled
                                    />
                                )}
                            />
                            <Button onClick={handleAdd} className="mt-8" variant="secondary" type="button">
                                <AppWindow />
                            </Button>
                        </div>
                        <Controller
                            name="userEmail"
                            control={control}
                            render={({ field }) => (
                                <FormInput
                                    type="text"
                                    label="Электронная почта"
                                    {...field}
                                    errors={errors}
                                    required
                                    disabled
                                />
                            )}
                        />
                        <Controller
                            name="userPhone"
                            control={control}
                            render={({ field }) => (
                                <FormInput
                                    type="text"
                                    label="Номер телефона"
                                    {...field}
                                    errors={errors}
                                    required
                                    disabled
                                />
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
                            items={orderPaymentStatus}
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
                <div className="p-1">
                    <p className="text-2xl mb-2 mt-2">Таблица товаров</p>
                    <OrdersTable rows_count={5} totalProp={orderTotal} onProductsChange={setProducts} data={products} />
                </div>
                <div className="flex items-center justify-end mt-5">
                    <Button type="submit" className="w-40">
                        Сохранить
                    </Button>
                </div>
            </form>
            {addWindow && !loading && (
                <SelectedUserWindow users={usersForTable} onClose={() => setAddWindow(false)} action={handleAddUser} />
            )}
        </div>
    );
};
