"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { formSchemaPrintings, FormValuesPrintings } from "./schema";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AdminSelect } from "@/components/admin-components/admin-select";
import { printingTypes } from "@/@types/enums";
import { Button } from "@/components/ui";
import { FormInput } from "@/components/inputs/form-input";
import { UseCloseTabOnSubmit } from "@/hooks/use-close-tab-on-submit";

export interface IPrintingsFormProps {
    defaultValues?: FormValuesPrintings;
    onSubmit: (data: FormValuesPrintings) => void;
    className?: string;
    id: string;
    href: string;
}

export const PrintingsForm = ({
    onSubmit,
    defaultValues,
    id,
    href,
    className
}: IPrintingsFormProps): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormValuesPrintings>({
        resolver: zodResolver(formSchemaPrintings),
        defaultValues: defaultValues || {
            name: ""
        }
    });

    const { closeTab } = UseCloseTabOnSubmit();

    const submitAction = (data: FormValuesPrintings) => {
        onSubmit(data);
        closeTab(id, href, "Печати");
        toast.success(`Печать "${data.name}" успешно сохранена!`);
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(submitAction)} className="flex gap-2">
                <div className="flex gap-2">
                    {/* <ImageInput name="image" /> */}
                    <div className="flex flex-col gap-2">
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <FormInput type="text" label="Название" {...field} errors={errors} required />
                            )}
                        />
                        <AdminSelect
                            name="printing_type"
                            value={watch("printing_type")}
                            onChange={value => setValue("printing_type", value)}
                            label="Тип печати"
                            items={printingTypes}
                            defaultValue={defaultValues?.printing_type}
                            errors={errors}
                            required
                        />
                        <Button type="submit">{defaultValues ? "Сохранить" : "Создать"}</Button>
                    </div>
                </div>
            </form>
        </div>
    );
};
