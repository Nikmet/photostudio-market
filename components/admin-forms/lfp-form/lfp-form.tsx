"use client";

import { Controller, useForm } from "react-hook-form";
import { formSchemaLFP, FormValuesLFP } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { onNumberValueChange } from "@/lib/inputs";
import { AdminSelect } from "@/components/admin-components/admin-select";
import { PaperType } from "@prisma/client";
import { Button } from "@/components/ui";
import { ImageInput } from "@/components/inputs/image-input";
import { FormInput } from "@/components/inputs/form-input";
import { UseCloseTabOnSubmit } from "@/hooks/use-close-tab-on-submit";

// Типы и константы для стандартных размеров
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

export interface ILfpFormProps {
    defaultValues?: FormValuesLFP;
    onSubmit: (data: FormValuesLFP) => void;
    className?: string;
    paperTypes: PaperType[];
    id: string;
    href: string;
}

export const LfpForm = ({
    onSubmit,
    defaultValues,
    paperTypes,
    id,
    href,
    className
}: ILfpFormProps): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormValuesLFP>({
        resolver: zodResolver(formSchemaLFP),
        defaultValues: defaultValues || {
            name: "",
            width: 0,
            height: 0
        }
    });

    const { closeTab } = UseCloseTabOnSubmit();

    const submitAction = (data: FormValuesLFP) => {
        onSubmit(data);
        closeTab(id, href, "ШФП");
        toast.success(`ШФП "${data.name}" успешно сохранена!`);
    };

    // Обработчик изменения стандартного размера
    const handleSizeChange = (size: string) => {
        setValue("size", size);

        if (STANDARD_SIZES[size]) {
            setValue("width", STANDARD_SIZES[size].width);
            setValue("height", STANDARD_SIZES[size].height);
        }
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(submitAction)} className="flex gap-6">
                <div>
                    <Controller
                        name="printing_image"
                        control={control}
                        render={({ field }) => (
                            <ImageInput
                                {...field}
                                label="Изображение"
                                errors={errors}
                                onChange={file => field.onChange(file)}
                                className="h-full"
                            />
                        )}
                    />
                </div>

                <div className="flex flex-col gap-4 w-1/2">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <FormInput type="text" label="Название" {...field} errors={errors} required />
                        )}
                    />

                    <AdminSelect
                        name="size"
                        value={watch("size")}
                        onChange={handleSizeChange}
                        label={"Стандартный размер"}
                        items={{
                            A3: "A3 (297×420 мм)",
                            A2: "A2 (420×594 мм)",
                            A1: "A1 (594×841 мм)",
                            custom: "Пользовательский размер"
                        }}
                        errors={errors}
                    />

                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    <AdminSelect
                        name="paper_type"
                        value={watch("paper_type_id")}
                        onChange={value => setValue("paper_type_id", value)}
                        route="paper-types"
                        label={"Тип бумаги"}
                        items={{
                            ...Object.fromEntries(paperTypes.map(type => [type.id, type.name]))
                        }}
                        defaultValue={defaultValues?.paper_type_id}
                        errors={errors}
                        required
                    />

                    <Button type="submit" className="mt-4">
                        {defaultValues ? "Сохранить" : "Создать"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
