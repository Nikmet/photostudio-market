"use client";

import { Button } from "@/components/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminSelect } from "../admin-select";
import { AddressPlaqueForm, Color } from "@prisma/client";
import toast from "react-hot-toast";
import { FormInput } from "../form-input";

const formSchema = z.object({
    name: z.string().min(2, "Название должно быть больше 2 символов"),
    address: z.string().min(2, "Адрес должен быть больше 2 символов"),
    colorId: z.string().min(1, "Выберите цвет"),
    formId: z.string().min(1, "Выберите форму")
});

export type FormValuesAddressPlaques = z.infer<typeof formSchema>;

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
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues || {
            name: ""
        }
    });

    const submitAction = (data: FormValuesAddressPlaques) => {
        onSubmit(data);
        toast.success(`Адресный аншлаг "${data.name}" успешно создан!`);
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
                    <FormInput
                        type="text"
                        label="Название"
                        defaultValue={defaultValues?.name}
                        {...form.register("name")}
                        errors={form.formState.errors}
                        required
                    />
                    <FormInput
                        type="text"
                        label="Адрес"
                        defaultValue={defaultValues?.address}
                        errors={form.formState.errors}
                        {...form.register("address")}
                        required
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
