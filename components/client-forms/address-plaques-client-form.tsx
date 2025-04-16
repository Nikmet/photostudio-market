"use client";

import { Button } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddressPlaqueForm, Color } from "@prisma/client";
import toast from "react-hot-toast";
import { FormInput } from "@/components/inputs/form-input";
import { formSchemaAddressPlaques, FormValuesAddressPlaques } from "../admin-forms/address-plaques-form/schema";
import { AdminSelect } from "../admin-components/admin-select";
import { useSession } from "next-auth/react";

export interface IAddressPlaquesFormProps {
    className?: string;
    defaultValues?: FormValuesAddressPlaques;
    onSubmit: (data: FormValuesAddressPlaques, userId: string) => void;
    colors: Color[];
    forms: AddressPlaqueForm[];
    id: string;
}

export const AddressPlaquesClientForm = ({
    onSubmit,
    defaultValues,
    colors,
    forms,
    id,
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

    const session = useSession();

    form.setValue("name", `Адресный аншлаг | ${id}`);

    const submitAction = (data: FormValuesAddressPlaques) => {
        try {
            onSubmit(data, session.data?.user.id);
            toast.success(`Адресный аншлаг "${data.name}" добавлен в корзину!`);
        } catch (e) {
            console.error(e);
        }
    };

    const selectedFormId = form.watch("formId");
    const selectedForm = forms.find(b => b.id === selectedFormId);

    return (
        <div className={className}>
            <form onSubmit={form.handleSubmit(submitAction)} className="flex gap-2">
                <div className="w-[600px] h-[500px] border border-gray-300 rounded-md mb-4">
                    <img
                        src={selectedForm?.image ?? "/logo_light.svg"}
                        alt={selectedForm?.name}
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="flex flex-col gap-2">
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
                        items={{
                            ...Object.fromEntries(forms.map(form => [form.id, form.name]))
                        }}
                        defaultValue={defaultValues?.formId}
                        errors={form.formState.errors}
                    />
                    <Button type="submit">Добавить в корзину</Button>
                </div>
            </form>
        </div>
    );
};
