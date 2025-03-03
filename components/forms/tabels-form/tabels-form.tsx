"use client";

import { Color } from "@prisma/client";
import { formSchemaTables, FormValuesTables } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FormInput } from "@/components/form-input";
import { onNumberValueChange } from "@/lib/inputs";
import { AdminSelect } from "@/components/admin-select";
import { Button } from "@/components/ui";

export interface INewslettersFormProps {
    defaultValues?: FormValuesTables;
    onSubmit: (data: FormValuesTables) => void;
    className?: string;
    colors: Color[];
}

export const TablesForm = ({
    colors,
    onSubmit,
    defaultValues,
    className
}: INewslettersFormProps): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormValuesTables>({
        resolver: zodResolver(formSchemaTables),
        defaultValues: defaultValues || {
            name: ""
        }
    });

    const submitAction = (data: FormValuesTables) => {
        onSubmit(data);
        toast.success(`Табличка "${data.name}" успешно сохранена!`);
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(submitAction)} className="flex gap-2">
                {/* <ImageInput name="image" /> */}
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
                        name="colorId"
                        value={watch("colorId")}
                        onChange={value => setValue("colorId", value)}
                        label={"Цвет"}
                        route="colors"
                        items={{
                            ...Object.fromEntries(colors.map(color => [color.id, color.name]))
                        }}
                        defaultValue={defaultValues?.colorId}
                        errors={errors}
                    />
                    <Button type="submit">{defaultValues ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
};
