"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui";
import { AdminSelect } from "@/components/admin-components/admin-select";
import { magnetTypes } from "@/@types/enums";
import { onNumberValueChange } from "@/lib/inputs";
import { ImageInput } from "@/components/inputs/image-input";
import { FormInput } from "@/components/inputs/form-input";
import { useSession } from "next-auth/react";
import { formSchemaMagnet, FormValuesMagnet } from "../admin-forms/magnets-form/schema";

export interface IMagnetsFormProps {
    defaultValues?: FormValuesMagnet;
    onSubmit: (data: FormValuesMagnet, userId: string) => void;
    className?: string;
    id: string;
}

export const MagnetsClientForm = ({ onSubmit, defaultValues, id, className }: IMagnetsFormProps): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormValuesMagnet>({
        resolver: zodResolver(formSchemaMagnet),
        defaultValues: defaultValues || {
            name: ""
        }
    });

    const session = useSession();

    setValue("name", `Магнитик | ${id}`);

    const submitAction = (data: FormValuesMagnet) => {
        try {
            onSubmit(data, session.data?.user.id);
            toast.success(`Магнитик "${data.name}" добавлен в корзину!`);
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
                            name="magnet_type"
                            value={watch("magnet_type")}
                            onChange={value => setValue("magnet_type", value)}
                            label="Тип магнита"
                            items={magnetTypes}
                            defaultValue={defaultValues?.magnet_type}
                            errors={errors}
                            required
                        />
                        <Button type="submit">Добавить в корзину</Button>
                    </div>
                </div>
            </form>
        </div>
    );
};
