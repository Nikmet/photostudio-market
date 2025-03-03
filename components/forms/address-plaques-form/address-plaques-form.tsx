"use client";

import { Button } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminSelect } from "../../admin-select";
import { AddressPlaqueForm, Color } from "@prisma/client";
import toast from "react-hot-toast";
import { FormInput } from "../../form-input";
import { formSchemaAddressPlaques, FormValuesAddressPlaques } from "./schema";

export interface IAddressPlaquesFormProps {
    className?: string;
    defaultValues?: FormValuesAddressPlaques;
    onSubmit: (data: FormValuesAddressPlaques) => void;
    colors: Color[];
    forms: AddressPlaqueForm[];
}

export const AddressPlaquesForm = ({
    onSubmit,
    defaultValues,
    colors,
    forms,
    className
}: IAddressPlaquesFormProps): React.JSX.Element => {
    const form = useForm<FormValuesAddressPlaques>({
        resolver: zodResolver(formSchemaAddressPlaques),
        defaultValues: defaultValues || {
            name: "",
            address: "",
            colorId: "",
            formId: ""
        }
    });

    const submitAction = (data: FormValuesAddressPlaques) => {
        onSubmit(data);
        toast.success(`Адресный аншлаг "${data.name}" успешно сохранен!`);
    };

    return (
        <div className={className}>
            <form onSubmit={form.handleSubmit(submitAction)} className="flex gap-2">
                <img
                    src="https://www.adverti.ru/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/4/6/4662_5.jpg"
                    alt="кружка"
                    width={500}
                    height={500}
                    className="rounded-md border border-gray-300"
                />
                <div className="flex flex-col gap-2">
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                            <FormInput {...field} label="Название" errors={form.formState.errors} required />
                        )}
                    />
                    <Controller
                        name="address"
                        control={form.control}
                        render={({ field }) => (
                            <FormInput {...field} label="Адрес" errors={form.formState.errors} required />
                        )}
                    />
                    <AdminSelect
                        name="colorId"
                        value={form.watch("colorId")}
                        onChange={value => form.setValue("colorId", value)}
                        label={"Цвет"}
                        route="colors"
                        items={{
                            ...Object.fromEntries(colors.map(color => [color.id, color.name]))
                        }}
                        defaultValue={defaultValues?.colorId}
                        errors={form.formState.errors}
                    />
                    <AdminSelect
                        name="formId"
                        value={form.watch("formId")}
                        onChange={value => form.setValue("formId", value)}
                        label={"Форма"}
                        route="address-plaque-form"
                        items={{
                            ...Object.fromEntries(forms.map(form => [form.id, form.name]))
                        }}
                        defaultValue={defaultValues?.formId}
                        errors={form.formState.errors}
                    />
                    <Button type="submit">{defaultValues ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
};
