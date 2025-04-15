"use client";

import { Button } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { formSchemaBaguette, FormValuesBaguette } from "./schema";
import { onNumberValueChange } from "@/lib/inputs";
import { UseCloseTabOnSubmit } from "@/hooks/use-close-tab-on-submit";
import { ImageInput } from "@/components/inputs/image-input";
import { FormInput } from "@/components/inputs/form-input";

export interface IBaguetteFormProps {
    defaultValues?: FormValuesBaguette;
    onSubmit: (data: FormValuesBaguette) => void;
    className?: string;
    id: string;
    href: string;
}

export const BaguetteForm = ({
    onSubmit,
    defaultValues,
    id,
    href,
    className
}: IBaguetteFormProps): React.JSX.Element => {
    const form = useForm<FormValuesBaguette>({
        resolver: zodResolver(formSchemaBaguette),
        defaultValues: defaultValues || {
            image: undefined
        }
    });

    const { closeTab } = UseCloseTabOnSubmit();

    const submitAction = (data: FormValuesBaguette) => {
        onSubmit(data);
        closeTab(id, href, "Багет");
        toast.success(`Багет успешно сохранен!`);
    };

    return (
        <div className={className}>
            <form onSubmit={form.handleSubmit(submitAction)} className="flex gap-2">
                <Controller
                    name="image"
                    control={form.control}
                    render={({ field }) => (
                        <ImageInput
                            {...field}
                            label="Изображение"
                            errors={form.formState.errors}
                            onChange={file => field.onChange(file)} // Передаем файл в форму
                        />
                    )}
                />
                <div className="flex gap-2 flex-col w-[300px]">
                    <Controller
                        name="serial_number"
                        control={form.control}
                        render={({ field }) => (
                            <FormInput
                                type="text"
                                label="Серийный номер"
                                errors={form.formState.errors}
                                required
                                {...field}
                            />
                        )}
                    />
                    <Controller
                        name="price"
                        control={form.control}
                        render={({ field: { onChange, ...field } }) => (
                            <FormInput
                                type="number"
                                label="Цена за метр"
                                onChange={e => onNumberValueChange(e, onChange)}
                                errors={form.formState.errors}
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
