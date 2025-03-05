"use client";

import { Button } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FormInput } from "@/components/form-input";
import { formSchemaCups, FormValuesCups } from "./schema";
import { ImageInput } from "@/components/image-input";

export interface ICupsFormProps {
    defaultValues?: FormValuesCups;
    onSubmit: (data: FormValuesCups) => void;
    className?: string;
}

export const CupsForm = ({ onSubmit, defaultValues, className }: ICupsFormProps): React.JSX.Element => {
    const form = useForm<FormValuesCups>({
        resolver: zodResolver(formSchemaCups),
        defaultValues: defaultValues || {
            name: "",
            printing_image: undefined
        }
    });

    console.log(defaultValues);

    const submitAction = (data: FormValuesCups) => {
        onSubmit(data);
        toast.success(`Кружка "${data.name}" успешно сохранена!`);
    };

    return (
        <div className={className}>
            <form onSubmit={form.handleSubmit(submitAction)} className="flex gap-2">
                <Controller
                    name="printing_image"
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
                <div className="flex gap-2">
                    <Controller
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormInput
                                type="text"
                                label="Название"
                                {...field}
                                errors={form.formState.errors}
                                required
                            />
                        )}
                    />
                    <Button type="submit">{defaultValues ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
};
