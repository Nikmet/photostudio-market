"use client";

import { Color } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { onNumberValueChange } from "@/lib/inputs";
import { AdminSelect } from "@/components/admin-components/admin-select";
import { Button } from "@/components/ui";
import { FormInput } from "@/components/inputs/form-input";
import { formSchemaNewsletters, FormValuesNewsletters } from "../admin-forms/newsletters-form/schema";
import { useSession } from "next-auth/react";
import { ImageInput } from "../inputs/image-input";

export interface INewslettersFormProps {
    defaultValues?: FormValuesNewsletters;
    onSubmit: (data: FormValuesNewsletters, userId: string) => void;
    className?: string;
    colors: Color[];
    id: string;
}

export const NewslettersClientForm = ({
    colors,
    onSubmit,
    defaultValues,
    id,
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

    const session = useSession();

    setValue("name", `Информационная вывеска | ${id}`);

    const submitAction = (data: FormValuesNewsletters) => {
        try {
            onSubmit(data, session.data?.user.id);
            toast.success(`Информационная вывеска "${data.name}" добавлена в корзину!`);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(submitAction)} className="flex gap-2">
                <Controller
                    name="printing_image"
                    control={control}
                    render={({ field }) => (
                        <ImageInput
                            {...field}
                            label="Изображение"
                            errors={errors}
                            onChange={file => field.onChange(file)} // Передаем файл в форму
                        />
                    )}
                />
                <div className="flex flex-col gap-2">
                    <Controller
                        name="width"
                        control={control}
                        render={({ field: { onChange, ...field } }) => (
                            <FormInput
                                type="number"
                                label="Ширина (мм)"
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
                                label="Высота (мм)"
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
                        items={{
                            ...Object.fromEntries(colors.map(color => [color.id, color.name]))
                        }}
                        defaultValue={defaultValues?.colorId}
                        errors={errors}
                    />
                    <Button type="submit">Добавить в корзину</Button>
                </div>
            </form>
        </div>
    );
};
