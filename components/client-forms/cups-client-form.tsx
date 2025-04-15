"use client";

import { Button } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ImageInput } from "@/components/inputs/image-input";
import { formSchemaCups, FormValuesCups } from "../admin-forms/cups-form/schema";
import { useSession } from "next-auth/react";

export interface ICupsFormProps {
    onSubmit: (data: FormValuesCups, userId: string) => void;
    className?: string;
    id: string;
}

export const CupsClientForm = ({ onSubmit, id, className }: ICupsFormProps): React.JSX.Element => {
    const form = useForm<FormValuesCups>({
        resolver: zodResolver(formSchemaCups)
    });

    const session = useSession();

    form.setValue("name", `Кружка | ${id}`);

    const submitAction = (data: FormValuesCups) => {
        try {
            onSubmit(data, session.data?.user.id);
            toast.success(`Кружка "${data.name}" добавлена в корзину!`);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={className}>
            <form
                encType="multipart/form-data"
                onSubmit={form.handleSubmit(submitAction)}
                className="flex flex-col w-[600px] gap-2"
            >
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
                <Button type="submit">Добавить в корзину</Button>
            </form>
        </div>
    );
};
