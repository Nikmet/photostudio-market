"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { formSchemaFrames, FormValuesFrames } from "./schema";
import toast from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import { onNumberValueChange } from "@/lib/inputs";
import { FormInput } from "@/components/form-input";
import { AdminCheckbox } from "@/components/admin-checkbox";
import { Baguette } from "@prisma/client";
import { AdminSelect } from "@/components/admin-select";
import { Button } from "@/components/ui";

export interface IFramesFormProps {
    defaultValues?: FormValuesFrames;
    onSubmit: (data: FormValuesFrames) => void;
    className?: string;
    baguettes: Baguette[];
}

export const FramesForm = ({ onSubmit, defaultValues, baguettes, className }: IFramesFormProps): React.JSX.Element => {
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

    const submitAction = (data: FormValuesFrames) => {
        onSubmit(data);
        toast.success(`Рамка ${data.name} успешно сохранена!`);
    };

    const selectedBaguetteId = watch("baguetteId");
    const selectedBaguette = baguettes.find(b => b.id === selectedBaguetteId);

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(submitAction)} className="flex gap-2">
                <div className="w-[600px] h-[500px] border border-gray-300 rounded-md mb-4">
                    <img
                        src={`/api/image/${selectedBaguette?.image_id}`}
                        alt={selectedBaguette?.serial_number || "кружка"}
                        className="w-full h-full object-contain"
                    />
                </div>

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
                    <Button type="submit">{defaultValues ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
};
