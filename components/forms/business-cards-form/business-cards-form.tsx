"use client";

import { Button } from "@/components/ui";
import { formSchemaBusinessCards, FormValuesBusinessCards } from "./schema";
import { AdminSelect } from "@/components/admin-select";
import { Controller, useForm } from "react-hook-form";
import { FormInput } from "@/components/form-input";
import { printingSides } from "@/@types/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ImageInput } from "@/components/image-input";

export interface IBusinessCardsFormProps {
    defaultValues?: FormValuesBusinessCards;
    onSubmit: (data: FormValuesBusinessCards) => void;
    className?: string;
}

export const BusinessCardsForm = ({
    defaultValues,
    onSubmit,
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

    const submitAction = (data: FormValuesBusinessCards) => {
        onSubmit(data);
        toast.success(`Визитка "${data.name}" успешно сохранена!`);
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
                                <FormInput type="text" label="Название" required errors={errors} {...field} />
                            )}
                        />
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

                        <Button type="submit">{defaultValues ? "Сохранить" : "Создать"}</Button>
                    </div>
                </div>
            </form>
        </div>
    );
};
