"use client";

import { Controller, useForm } from "react-hook-form";
import { formSchemaLEC, FormValuesLEC } from "./schema";
import { FormInput } from "@/components/form-input";
import { onNumberValueChange } from "@/lib/inputs";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AdminSelect } from "@/components/admin-select";
import { difficile } from "@/@types/enums";
import { Button } from "@/components/ui";

export interface ILecFormProps {
    defaultValues?: FormValuesLEC;
    onSubmit: (data: FormValuesLEC) => void;
    className?: string;
}

export const LecForm = ({ onSubmit, defaultValues, className }: ILecFormProps): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormValuesLEC>({
        resolver: zodResolver(formSchemaLEC),
        defaultValues: defaultValues || {
            name: ""
        }
    });

    const submitAction = (data: FormValuesLEC) => {
        onSubmit(data);
        toast.success(`ЛГР "${data.name}" успешно сохранена!`);
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(submitAction)} className="flex gap-2">
                <img
                    src="https://www.adverti.ru/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/4/6/4662_5.jpg"
                    alt="кружка"
                    width={500}
                    height={500}
                    className="rounded-md border border-gray-300"
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
                        name="difficile"
                        value={watch("difficile")}
                        onChange={value => setValue("difficile", value)}
                        label={"Сложность"}
                        items={difficile}
                        defaultValue={defaultValues?.difficile}
                        errors={errors}
                        required
                    />
                    <Button type="submit">{defaultValues ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
};
