"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { onNumberValueChange } from "@/lib/inputs";
import { Button } from "@/components/ui";
import { ImageInput } from "@/components/inputs/image-input";
import { FormInput } from "@/components/inputs/form-input";
import { formSchemaStands, FormValuesStands } from "../admin-forms/stands-form/schema";
import { useSession } from "next-auth/react";

export interface IStandsFormProps {
    className?: string;
    defaultValues?: FormValuesStands;
    onSubmit: (data: FormValuesStands, userId: string) => void;
    id: string;
}

export const StandsClientsForm = ({ onSubmit, defaultValues, id, className }: IStandsFormProps): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<FormValuesStands>({
        resolver: zodResolver(formSchemaStands),
        defaultValues: defaultValues || {
            name: ""
        }
    });

    const session = useSession();

    setValue("name", `Стенд | ${id}`);

    const submitAction = (data: FormValuesStands) => {
        try {
            onSubmit(data, session.data?.user.id);
            toast.success(`Стенд "${data.name}" добавлен в корзину!`);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(submitAction)} className="flex gap-2">
                <div className="flex gap-2">
                    <Controller
                        name="printing_image"
                        control={control}
                        render={({ field }) => (
                            <ImageInput
                                {...field}
                                label="Изображение"
                                errors={errors}
                                onChange={file => field.onChange(file)}
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
                        <Controller
                            name="pocket_count"
                            control={control}
                            render={({ field: { onChange, ...field } }) => (
                                <FormInput
                                    type="number"
                                    label="Количество карманов"
                                    {...field}
                                    onChange={e => onNumberValueChange(e, onChange)}
                                    errors={errors}
                                    required
                                />
                            )}
                        />

                        <Button type="submit">Добавить в корзину</Button>
                    </div>
                </div>
            </form>
        </div>
    );
};
