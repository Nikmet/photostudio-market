"use client";

import { Button } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FormInput } from "../../form-input";
import { formSchemaAddressPlaqueForms, FormValuesAddressPlaqueForms } from "./schema";
import { onNumberValueChange } from "@/lib/inputs";
import { UseCloseTabOnSubmit } from "@/hooks/use-close-tab-on-submit";
import { ImageInput } from "@/components/image-input";

export interface IAddressPlaqueFormsFormProps {
    className?: string;
    defaultValues?: FormValuesAddressPlaqueForms;
    onSubmit: (data: FormValuesAddressPlaqueForms) => void;
    id: string;
    href: string;
}

export const AddressPlaqueFormsForm = ({
    className,
    defaultValues,
    onSubmit,
    id,
    href
}: IAddressPlaqueFormsFormProps): React.JSX.Element => {
    const {
        handleSubmit,
        formState: { errors },
        control
    } = useForm<FormValuesAddressPlaqueForms>({
        resolver: zodResolver(formSchemaAddressPlaqueForms),
        defaultValues: defaultValues || {
            name: ""
        }
    });

    const { closeTab } = UseCloseTabOnSubmit();

    const submitAction = (data: FormValuesAddressPlaqueForms) => {
        onSubmit(data);

        closeTab(id, href, "Формы адресных аншлагов");
        toast.success(`Форма адресного аншлага "${data.name}" успешно сохранен!`);
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(submitAction)} className="flex gap-2">
                <Controller
                    name="image"
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
                <div className="flex gap-2">
                    <Controller
                        control={control}
                        name="name"
                        render={({ field }) => <FormInput label="Название" {...field} required errors={errors} />}
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
                        name="price"
                        control={control}
                        render={({ field: { onChange, ...field } }) => (
                            <FormInput
                                type="number"
                                label="Цена"
                                onChange={e => onNumberValueChange(e, onChange)}
                                errors={errors}
                                required
                                {...field}
                            />
                        )}
                    />
                    <Button type="submit">{defaultValues ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
};
