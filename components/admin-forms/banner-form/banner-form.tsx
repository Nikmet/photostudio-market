"use client";

import { density } from "@/@types/enums";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AdminSelect } from "../../admin-components/admin-select";
import { Button } from "../../ui";
import React from "react";
import { onNumberValueChange } from "@/lib/inputs";
import { formSchemaBanners, FormValuesBanner } from "./schema";
import { ImageInput } from "@/components/inputs/image-input";
import { FormInput } from "@/components/inputs/form-input";
import { UseCloseTabOnSubmit } from "@/hooks/use-close-tab-on-submit";

export interface IBannerFormProps {
    defaultValues?: FormValuesBanner;
    onSubmit: (data: FormValuesBanner) => void;
    className?: string;
    id: string;
    href: string;
}

export const BannerForm = ({ onSubmit, defaultValues, href, id, className }: IBannerFormProps): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormValuesBanner>({
        resolver: zodResolver(formSchemaBanners),
        defaultValues: defaultValues || {
            name: ""
        }
    });

    const { closeTab } = UseCloseTabOnSubmit();

    const width = watch("width");
    const height = watch("height");
    const luversStep = watch("luvers_step");

    React.useEffect(() => {
        if (width && height && luversStep) {
            const calculatedLuversCount = Math.round(((width + height) * 2) / luversStep);
            setValue("luvers_count", calculatedLuversCount);
        }
    }, [width, height, luversStep, setValue]);

    const submitAction = (data: FormValuesBanner) => {
        onSubmit(data);
        closeTab(id, href, "Банеры");
        toast.success(`Банер успешно сохранен!`);
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
                        name="luvers_step"
                        control={control}
                        render={({ field: { onChange, ...field } }) => (
                            <FormInput
                                type="number"
                                label="Шаг люверсов"
                                {...field}
                                onChange={e => onNumberValueChange(e, onChange)}
                                errors={errors}
                                required
                            />
                        )}
                    />
                    <Controller
                        name="luvers_count"
                        control={control}
                        render={({ field }) => (
                            <FormInput type="number" label="Кол.-во люверсов" {...field} disabled errors={errors} />
                        )}
                    />

                    <AdminSelect
                        name="density"
                        value={watch("density")}
                        onChange={value => setValue("density", value)}
                        label={"Плотность"}
                        items={density}
                        defaultValue={defaultValues?.density}
                        errors={errors}
                        required
                    />
                    <Button type="submit">{defaultValues ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
};
