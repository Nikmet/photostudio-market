"use client";

import { Color } from "@prisma/client";
import { formSchemaNewsletters, FormValuesNewsletters } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { onNumberValueChange } from "@/lib/inputs";
import { AdminSelect } from "@/components/admin-components/admin-select";
import { Button } from "@/components/ui";
import { FormInput } from "@/components/inputs/form-input";

export interface INewslettersFormProps {
    defaultValues?: FormValuesNewsletters;
    onSubmit: (data: FormValuesNewsletters) => void;
    className?: string;
    colors: Color[];
}

export const NewslettersForm = ({
    colors,
    onSubmit,
    defaultValues,
    className
}: INewslettersFormProps): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormValuesNewsletters>({
        resolver: zodResolver(formSchemaNewsletters),
        defaultValues: defaultValues || {
            name: ""
        }
    });

    const submitAction = (data: FormValuesNewsletters) => {
        onSubmit(data);
        toast.success(`Информационная табличка "${data.name}" успешно сохранена!`);
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(submitAction)} className="flex gap-2">
                <div className="flex flex-col gap-2">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <FormInput type="text" label="Название" {...field} errors={errors} required />
                        )}
                    />
                    <Controller
                        name="width"
                        control={control}
                        render={({ field: { onChange, ...field } }) => (
                            <FormInput
                                type="number"
                                label="Ширина"
                                {...field}
                                onChange={e => onNumberValueChange(e, onChange)}
                                errors={errors}
                                required
                            />
                        )}
                    />
                    <Controller
                        name="height"
                        control={control}
                        render={({ field: { onChange, ...field } }) => (
                            <FormInput
                                type="number"
                                label="Высота"
                                {...field}
                                onChange={e => onNumberValueChange(e, onChange)}
                                errors={errors}
                                required
                            />
                        )}
                    />
                    <AdminSelect
                        name="colorId"
                        value={watch("colorId")}
                        onChange={value => setValue("colorId", value)}
                        label={"Цвет"}
                        route="colors"
                        items={{
                            ...Object.fromEntries(colors.map(color => [color.id, color.name]))
                        }}
                        defaultValue={defaultValues?.colorId}
                        errors={errors}
                    />
                    <Button type="submit">{defaultValues ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
};
