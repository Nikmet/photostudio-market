"use client";

import { z } from "zod";
import { FormInput } from "../form-input";
import { density } from "@/@types/enums";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AdminSelect } from "../admin-select";
import { Button } from "../ui";
import { BannerDensity } from "@prisma/client";
import React from "react";

export interface IBannerFormProps {
    defaultValues?: FormValuesBanner;
    onSubmit: (data: FormValuesBanner) => void;
    className?: string;
}

const formSchema = z.object({
    name: z.string().min(1, "Поле обязательно"), // Кастомное сообщение для обязательного поля
    density: z.enum(Object.values(BannerDensity) as [string, ...string[]], {
        required_error: "Поле обязательно" // Кастомное сообщение для обязательного поля
    }),
    height: z.number({
        required_error: "Поле обязательно", // Кастомное сообщение для обязательного поля
        invalid_type_error: "Значение должно быть числом"
    }),
    width: z.number({
        required_error: "Поле обязательно", // Кастомное сообщение для обязательного поля
        invalid_type_error: "Значение должно быть числом"
    }),
    luvers_count: z.number({
        required_error: "Поле обязательно", // Кастомное сообщение для обязательного поля
        invalid_type_error: "Значение должно быть числом"
    }),
    luvers_step: z.number({
        required_error: "Поле обязательно", // Кастомное сообщение для обязательного поля
        invalid_type_error: "Значение должно быть числом"
    })
});

export type FormValuesBanner = z.infer<typeof formSchema>;

export const BannerForm = ({ onSubmit, defaultValues, className }: IBannerFormProps): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormValuesBanner>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues || {
            name: ""
        }
    });

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
        toast.success(`Банер успешно сохранен!`);
    };

    const onNumberValueChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
        const value = e.target.value;
        onChange(value === "" ? "" : Number(value));
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(submitAction)} className="flex gap-2">
                <img
                    src="https://www.adverti.ru/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/4/6/4662_5.jpg"
                    alt="кружка"
                    width={500}
                    height={500}
                    className="rounded-md border border-gray-300"
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
