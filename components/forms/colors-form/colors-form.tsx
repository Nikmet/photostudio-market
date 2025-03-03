"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { formSchemaColors, FormValuesColors } from "./schema";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FormInput } from "@/components/form-input";
import { Button } from "@/components/ui";
import { onNumberValueChange } from "@/lib/inputs";

export interface IColorsFormProps {
    defaultValues?: FormValuesColors;
    onSubmit: (data: FormValuesColors) => void;
    className?: string;
}

export const ColorsForm = ({ onSubmit, defaultValues, className }: IColorsFormProps): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<FormValuesColors>({
        resolver: zodResolver(formSchemaColors),
        defaultValues: defaultValues || {
            name: "",
            rgb: "0,0,0"
        }
    });

    const submitAction = (data: FormValuesColors) => {
        onSubmit(data);
        toast.success(`Цвет "${data.name}" успешно сохранена!`);
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(submitAction)} className="flex gap-2">
                <div className="flex gap-2">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <FormInput type="text" label="Название" required errors={errors} {...field} />
                        )}
                    />
                    <Controller
                        name="rgb"
                        control={control}
                        render={({ field }) => (
                            <FormInput
                                type="color"
                                label="Цвет"
                                required
                                errors={errors}
                                {...field}
                                defaultValue={defaultValues?.rgb}
                            />
                        )}
                    />
                    <Controller
                        name="price"
                        control={control}
                        render={({ field: { onChange, ...field } }) => (
                            <FormInput
                                type="number"
                                label="Цена за кв. метр"
                                onChange={e => onNumberValueChange(e, onChange)}
                                errors={errors}
                                required
                                {...field}
                            />
                        )}
                    />
                    <Button type="submit">{defaultValues ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
};
