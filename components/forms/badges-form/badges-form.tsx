"use client";

import { Button } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { formSchemaBadges, FormValuesBadges } from "./schema";
import { FormInput } from "@/components/form-input";
import { UseCloseTabOnSubmit } from "@/hooks/use-close-tab-on-submit";
import { ImageInput } from "@/components/image-input";

export interface IBadgesFormProps {
    defaultValues?: FormValuesBadges;
    onSubmit: (data: FormValuesBadges) => void;
    className?: string;
    id: string;
    href: string;
}

export const BadgesForm = ({ onSubmit, defaultValues, id, href, className }: IBadgesFormProps): React.JSX.Element => {
    const form = useForm<FormValuesBadges>({
        resolver: zodResolver(formSchemaBadges),
        defaultValues: defaultValues || {
            name: ""
        }
    });

    const { closeTab } = UseCloseTabOnSubmit();

    const submitAction = (data: FormValuesBadges) => {
        onSubmit(data);
        closeTab(id, href, "Значки");
        toast.success(`Значок "${data.name}" успешно сохранен!`);
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
