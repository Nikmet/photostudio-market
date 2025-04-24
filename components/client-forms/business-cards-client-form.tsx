"use client";

import { Button } from "@/components/ui";
import { AdminSelect } from "@/components/admin-components/admin-select";
import { Controller, useForm } from "react-hook-form";
import { printingSides } from "@/@types/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ImageInput } from "@/components/inputs/image-input";
import { formSchemaBusinessCards, FormValuesBusinessCards } from "../admin-forms/business-cards-form/schema";
import { useSession } from "next-auth/react";

export interface IBusinessCardsFormProps {
    defaultValues?: FormValuesBusinessCards;
    onSubmit: (data: FormValuesBusinessCards, userId: string) => void;
    className?: string;
    id: string;
}

export const BusinessCardsClientForm = ({
    defaultValues,
    onSubmit,
    id,
    className
}: IBusinessCardsFormProps): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormValuesBusinessCards>({
        resolver: zodResolver(formSchemaBusinessCards),
        defaultValues: defaultValues || {
            name: ""
        }
    });

    const session = useSession();

    setValue("name", `Визитки (100шт.) | ${id}`);

    const submitAction = (data: FormValuesBusinessCards) => {
        try {
            onSubmit(data, session.data?.user.id);
            toast.success(`Визитки "${data.name}" добавлены в корзину!`);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={className}>
            <form
                onSubmit={handleSubmit(submitAction)}
                className="flex flex-col items-center 2xl:items-start 2xl:flex-row gap-2"
            >
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
                        <AdminSelect
                            name="printing_side"
                            value={watch("printing_side")}
                            onChange={value => setValue("printing_side", value)}
                            label={"Стороны печати"}
                            items={printingSides}
                            defaultValue={defaultValues?.printing_side}
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
