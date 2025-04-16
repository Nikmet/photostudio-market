"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AdminSelect } from "@/components/admin-components/admin-select";
import { printingSides, sizes } from "@/@types/enums";
import { Button } from "@/components/ui";
import { ImageInput } from "@/components/inputs/image-input";
import { useSession } from "next-auth/react";
import { formSchemaTShirts, FormValuesTShirts } from "../admin-forms/t-shirts-form/schema";

export interface ITShirtsFormProps {
    className?: string;
    defaultValues?: FormValuesTShirts;
    onSubmit: (data: FormValuesTShirts, userId: string) => void;
    id: string;
}

export const TShirtsClientForm = ({ onSubmit, defaultValues, id, className }: ITShirtsFormProps): React.JSX.Element => {
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

    const session = useSession();

    setValue("name", `Футболка | ${id}`);

    const submitAction = (data: FormValuesTShirts) => {
        try {
            onSubmit(data, session.data?.user.id);
            toast.success(`Футболка "${data.name}" добавлена в корзину!`);
        } catch (e) {
            console.error(e);
        }
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
                        <Button type="submit">Добавить в корзину</Button>
                    </div>
                </div>
            </form>
        </div>
    );
};
