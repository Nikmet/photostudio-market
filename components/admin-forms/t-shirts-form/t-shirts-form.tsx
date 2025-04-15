"use client";

import { Controller, useForm } from "react-hook-form";
import { formSchemaTShirts, FormValuesTShirts } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AdminSelect } from "@/components/admin-components/admin-select";
import { printingSides, sizes } from "@/@types/enums";
import { Button } from "@/components/ui";
import { ImageInput } from "@/components/inputs/image-input";
import { FormInput } from "@/components/inputs/form-input";

export interface ITShirtsFormProps {
    className?: string;
    defaultValues?: FormValuesTShirts;
    onSubmit: (data: FormValuesTShirts) => void;
}

export const TShirtsForm = ({ onSubmit, defaultValues, className }: ITShirtsFormProps): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormValuesTShirts>({
        resolver: zodResolver(formSchemaTShirts),
        defaultValues: defaultValues || {
            name: "",
            printing_image: undefined
        }
    });

    const submitAction = (data: FormValuesTShirts) => {
        onSubmit(data);
        toast.success(`Футболка "${data.name}" успешно сохранена!`);
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(submitAction)} className="flex gap-2">
                <div className="flex gap-4">
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
                    <div className="flex flex-col gap-4 w-[500px]">
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <FormInput type="text" label="Название" required errors={errors} {...field} />
                            )}
                        />
                        <AdminSelect
                            name="printing_side"
                            value={watch("printingSide")}
                            onChange={value => setValue("printingSide", value)}
                            label={"Стороны печати"}
                            items={printingSides}
                            defaultValue={defaultValues?.printingSide}
                            errors={errors}
                            required
                        />
                        <AdminSelect
                            name="size"
                            label={"Размер"}
                            value={watch("size")}
                            onChange={value => setValue("size", value)}
                            items={sizes}
                            defaultValue={defaultValues?.size}
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
