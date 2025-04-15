"use client";

import { Button } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { formSchemaCups, FormValuesCups } from "./schema";
import { ImageInput } from "@/components/inputs/image-input";
import { FormInput } from "@/components/inputs/form-input";

export interface ICupsFormProps {
    defaultValues?: FormValuesCups;
    onSubmit: (data: FormValuesCups) => void;
    className?: string;
}

export const CupsForm = ({ onSubmit, defaultValues, className }: ICupsFormProps): React.JSX.Element => {
    const form = useForm<FormValuesCups>({
        resolver: zodResolver(formSchemaCups),
        defaultValues: defaultValues || {
            name: ""
        }
    });

    const submitAction = (data: FormValuesCups) => {
        try {
            onSubmit(data);
            toast.success(`Кружка "${data.name}" успешно сохранена!`);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={className}>
            <form encType="multipart/form-data" onSubmit={form.handleSubmit(submitAction)} className="flex gap-2">
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
                <div className="flex gap-2 flex-col w-[300px]">
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
