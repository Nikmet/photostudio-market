"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { formSchemaStands, FormValuesStands } from "./schema";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { onNumberValueChange } from "@/lib/inputs";
import { Button } from "@/components/ui";
import { ImageInput } from "@/components/inputs/image-input";
import { FormInput } from "@/components/inputs/form-input";

export interface IStandsFormProps {
    className?: string;
    defaultValues?: FormValuesStands;
    onSubmit: (data: FormValuesStands) => void;
}

export const StandsForm = ({ onSubmit, defaultValues, className }: IStandsFormProps): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<FormValuesStands>({
        resolver: zodResolver(formSchemaStands),
        defaultValues: defaultValues || {
            name: ""
        }
    });

    const submitAction = (data: FormValuesStands) => {
        onSubmit(data);
        toast.success(`Стенд "${data.name}" успешно сохранен!`);
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
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <FormInput type="text" label="Название" {...field} errors={errors} required />
                            )}
                        />
                        <Controller
                            name="width"
                            control={control}
                            render={({ field: { onChange, ...field } }) => (
                                <FormInput
                                    type="number"
                                    label="Ширина"
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
                                    label="Высота"
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

                        <Button type="submit">{defaultValues ? "Сохранить" : "Создать"}</Button>
                    </div>
                </div>
            </form>
        </div>
    );
};
