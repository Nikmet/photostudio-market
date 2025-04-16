"use client";

import { density } from "@/@types/enums";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import React from "react";
import { onNumberValueChange } from "@/lib/inputs";
import { ImageInput } from "@/components/inputs/image-input";
import { FormInput } from "@/components/inputs/form-input";
import { formSchemaBanners, FormValuesBanner } from "../admin-forms/banner-form/schema";
import { AdminSelect } from "../admin-components/admin-select";
import { useSession } from "next-auth/react";
import { Button } from "../ui";

export interface IBannerFormProps {
    defaultValues?: FormValuesBanner;
    onSubmit: (data: FormValuesBanner, userId: string) => void;
    className?: string;
    id: string;
}

export const BannerClientForm = ({ onSubmit, defaultValues, id, className }: IBannerFormProps): React.JSX.Element => {
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

    const session = useSession();

    setValue("name", `Баннер | ${id}`);

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
        try {
            onSubmit(data, session.data?.user.id);
            toast.success(`Баннер "${data.name}" добавлен в корзину!`);
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
                            <FormInput type="number" label="Кол.-во люверсов (шт.)" {...field} disabled errors={errors} />
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
                    <Button type="submit">Добавить в корзину</Button>
                </div>
            </form>
        </div>
    );
};
