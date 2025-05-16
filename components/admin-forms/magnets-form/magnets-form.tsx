"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { formSchemaMagnet, FormValuesMagnet } from "./schema";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui";
import { AdminSelect } from "@/components/admin-components/admin-select";
import { magnetTypes } from "@/@types/enums";
import { onNumberValueChange } from "@/lib/inputs";
import { ImageInput } from "@/components/inputs/image-input";
import { FormInput } from "@/components/inputs/form-input";
import { UseCloseTabOnSubmit } from "@/hooks/use-close-tab-on-submit";

export interface IMagnetsFormProps {
    defaultValues?: FormValuesMagnet;
    onSubmit: (data: FormValuesMagnet) => void;
    className?: string;
    id: string;
    href: string;
}

export const MagnetsForm = ({ onSubmit, defaultValues, id, href, className }: IMagnetsFormProps): React.JSX.Element => {
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

    const { closeTab } = UseCloseTabOnSubmit();

    const submitAction = (data: FormValuesMagnet) => {
        onSubmit(data);
        closeTab(id, href, "Магниты");
        toast.success(`Магнит "${data.name}" успешно сохранен!`);
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
                        <Button type="submit">{defaultValues ? "Сохранить" : "Создать"}</Button>
                    </div>
                </div>
            </form>
        </div>
    );
};
