"use client";

import { Button } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FormInput } from "@/components/form-input";
import { ImageInput } from "@/components/image-input";
import { formSchemaPromo, FormValuesPromo } from "./schema";
import { TiptapEditor } from "@/components/tiptap-editor";

export interface IPromoFormProps {
    defaultValues?: FormValuesPromo;
    onSubmit: (data: FormValuesPromo) => void;
    className?: string;
}

export const PromoForm = ({ onSubmit, defaultValues, className }: IPromoFormProps): React.JSX.Element => {
    const form = useForm<FormValuesPromo>({
        resolver: zodResolver(formSchemaPromo),
        defaultValues: defaultValues || {
            title: "",
            alt: "",
            route: "",
            content: ""
        }
    });

    const submitAction = (data: FormValuesPromo) => {
        try {
            onSubmit(data);
            toast.success(`Промо-страница "${data.title}" успешно сохранена!`);
        } catch (e) {
            console.error(e);
            toast.error("Произошла ошибка при сохранении");
        }
    };

    return (
        <div className={className}>
            <form
                encType="multipart/form-data"
                onSubmit={form.handleSubmit(submitAction)}
                className="flex gap-6 flex-col"
            >
                <div className="flex gap-4 flex-col md:flex-row">
                    <Controller
                        name="image"
                        control={form.control}
                        render={({ field }) => (
                            <ImageInput
                                {...field}
                                label="Изображение"
                                errors={form.formState.errors}
                                onChange={file => field.onChange(file)}
                            />
                        )}
                    />

                    <div className="flex gap-4 flex-col w-full md:w-[300px]">
                        <Controller
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormInput
                                    type="text"
                                    label="Заголовок"
                                    {...field}
                                    errors={form.formState.errors}
                                    required
                                />
                            )}
                        />
                        <Controller
                            control={form.control}
                            name="alt"
                            render={({ field }) => (
                                <FormInput
                                    type="text"
                                    label="Замещающий текст"
                                    {...field}
                                    errors={form.formState.errors}
                                    required
                                />
                            )}
                        />
                        <Controller
                            control={form.control}
                            name="route"
                            render={({ field }) => (
                                <FormInput
                                    type="text"
                                    label="Путь страницы"
                                    {...field}
                                    errors={form.formState.errors}
                                    required
                                />
                            )}
                        />
                    </div>
                </div>

                <Controller
                    name="content"
                    control={form.control}
                    render={({ field }) => (
                        <TiptapEditor
                            value={field.value}
                            onChange={field.onChange}
                            error={form.formState.errors.content?.message}
                        />
                    )}
                />

                <Button type="submit" className="self-start">
                    {defaultValues ? "Сохранить" : "Создать"}
                </Button>
            </form>
        </div>
    );
};
