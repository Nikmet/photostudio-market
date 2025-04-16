"use client";

import { Button } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ImageInput } from "@/components/inputs/image-input";
import { formSchemaBadges, FormValuesBadges } from "../admin-forms/badges-form/schema";
import { useSession } from "next-auth/react";

export interface IBadgesFormProps {
    defaultValues?: FormValuesBadges;
    onSubmit: (data: FormValuesBadges, userId: string) => void;
    className?: string;
    id: string;
}

export const BadgesClientForm = ({ onSubmit, defaultValues, id, className }: IBadgesFormProps): React.JSX.Element => {
    const form = useForm<FormValuesBadges>({
        resolver: zodResolver(formSchemaBadges),
        defaultValues: defaultValues || {
            name: ""
        }
    });

    const session = useSession();

    form.setValue("name", `Значок | ${id}`);

    const submitAction = (data: FormValuesBadges) => {
        try {
            onSubmit(data, session.data?.user.id);
            toast.success(`Значок "${data.name}" добавлен в корзину!`);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={className}>
            <form onSubmit={form.handleSubmit(submitAction)} className="flex flex-col w-[600px] gap-2">
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
