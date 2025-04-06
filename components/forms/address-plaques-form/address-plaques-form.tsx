"use client";

import { Button } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminSelect } from "../../admin-select";
import { AddressPlaqueForm, Color } from "@prisma/client";
import toast from "react-hot-toast";
import { FormInput } from "../../form-input";
import { formSchemaAddressPlaques, FormValuesAddressPlaques } from "./schema";
import { UseCloseTabOnSubmit } from "@/hooks/use-close-tab-on-submit";

export interface IAddressPlaquesFormProps {
    className?: string;
    defaultValues?: FormValuesAddressPlaques;
    onSubmit: (data: FormValuesAddressPlaques) => void;
    colors: Color[];
    forms: AddressPlaqueForm[];
    id: string;
    href: string;
}

export const AddressPlaquesForm = ({
    onSubmit,
    defaultValues,
    colors,
    forms,
    href,
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

    const { closeTab } = UseCloseTabOnSubmit();

    const submitAction = (data: FormValuesAddressPlaques) => {
        onSubmit(data);
        closeTab(id, href, "Адресные аншлаги");
        toast.success(`Адресный аншлаг "${data.name}" успешно сохранен!`);
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
