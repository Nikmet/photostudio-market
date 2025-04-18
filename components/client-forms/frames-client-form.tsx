"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import { onNumberValueChange } from "@/lib/inputs";
import { AdminCheckbox } from "@/components/admin-components/admin-checkbox";
import { Baguette } from "@prisma/client";
import { AdminSelect } from "@/components/admin-components/admin-select";
import { Button } from "@/components/ui";
import { FormInput } from "@/components/inputs/form-input";
import { formSchemaFrames, FormValuesFrames } from "../admin-forms/frames-form/schema";
import { useSession } from "next-auth/react";

// Добавим типы для стандартных размеров
type StandardSize = {
    width: number;
    height: number;
};

const STANDARD_SIZES: Record<string, StandardSize> = {
    A5: { width: 148, height: 210 },
    A4: { width: 210, height: 297 },
    A3: { width: 297, height: 420 },
    A2: { width: 420, height: 594 },
    A1: { width: 594, height: 841 }
    // Можно добавить другие стандартные размеры
};

export interface IFramesFormProps {
    defaultValues?: FormValuesFrames;
    onSubmit: (data: FormValuesFrames, userId: string) => void;
    className?: string;
    baguettes: Baguette[];
    id: string;
}

export const FramesClientForm = ({
    onSubmit,
    defaultValues,
    baguettes,
    id,
    className
}: IFramesFormProps): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormValuesFrames>({
        resolver: zodResolver(formSchemaFrames),
        defaultValues: defaultValues || {
            name: "",
            has_glass: false,
            has_backdrop: false,
            has_suspension: false
        }
    });

    const session = useSession();

    setValue("name", `Рамка | ${id}`);

    const submitAction = (data: FormValuesFrames) => {
        try {
            onSubmit(data, session.data?.user.id);
            toast.success(`Рамка "${data.name}" добавлена в корзину!`);
        } catch (e) {
            console.error(e);
        }
    };

    const selectedBaguetteId = watch("baguetteId");
    const selectedBaguette = baguettes.find(b => b.id === selectedBaguetteId);

    // Обработчик изменения размера
    const handleSizeChange = (size: string) => {
        setValue("size", size);

        // Если выбран стандартный размер, устанавливаем соответствующие ширину и высоту
        if (STANDARD_SIZES[size]) {
            setValue("width", STANDARD_SIZES[size].width);
            setValue("height", STANDARD_SIZES[size].height);
        }
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(submitAction)} className="flex gap-2">
                <div className="w-[600px] h-[500px] border border-gray-300 rounded-md mb-4 p-4">
                    <img
                        src={selectedBaguette?.image ?? "/logo_light.svg"}
                        alt={selectedBaguette?.serial_number}
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="flex flex-col gap-2 w-[300px]">
                    <AdminSelect
                        name="size"
                        value={watch("size")}
                        onChange={handleSizeChange}
                        label={"Размер"}
                        items={{
                            A5: "A5 (148×210 мм)",
                            A4: "A4 (210×297 мм)",
                            A3: "A3 (297×420 мм)",
                            A2: "A2 (420×594 мм)",
                            A1: "A1 (594×841 мм)",
                            custom: "Пользовательский размер"
                        }}
                        errors={errors}
                        required
                    />
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
                        name="has_glass"
                        control={control}
                        render={({ field }) => (
                            <AdminCheckbox {...field} checked={field.value} onChange={field.onChange} label="Стекло" />
                        )}
                    />
                    <Controller
                        name="has_backdrop"
                        control={control}
                        render={({ field }) => (
                            <AdminCheckbox {...field} checked={field.value} onChange={field.onChange} label="Задник" />
                        )}
                    />
                    <Controller
                        name="has_suspension"
                        control={control}
                        render={({ field }) => (
                            <AdminCheckbox {...field} checked={field.value} onChange={field.onChange} label="Подвес" />
                        )}
                    />
                    <AdminSelect
                        name="baguette"
                        value={watch("baguetteId")}
                        onChange={value => setValue("baguetteId", value)}
                        route="baguettes"
                        label={"Багет"}
                        items={{
                            ...Object.fromEntries(baguettes.map(baguette => [baguette.id, baguette.serial_number]))
                        }}
                        defaultValue={defaultValues?.baguetteId}
                        errors={errors}
                        required
                    />
                    <Button type="submit">Добавить в корзину</Button>
                </div>
            </form>
        </div>
    );
};
