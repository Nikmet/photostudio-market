"use client";

import { Button } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FormInput } from "../../form-input";
import { formSchemaAddressPlaqueForms, FormValuesAddressPlaqueForms } from "./schema";
import { onNumberValueChange } from "@/lib/inputs";

export interface IAddressPlaqueFormsFormProps {
    className?: string;
    defaultValues?: FormValuesAddressPlaqueForms;
    onSubmit: (data: FormValuesAddressPlaqueForms) => void;
}

export const AddressPlaqueFormsForm = ({
    className,
    defaultValues,
    onSubmit
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

    const submitAction = (data: FormValuesAddressPlaqueForms) => {
        onSubmit(data);
        toast.success(`Форма адресного аншлага "${data.name}" успешно сохранен!`);
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
                <div className="flex gap-2">
                    <Controller
                        control={control}
                        name="name"
                        render={({ field }) => <FormInput label="Название" {...field} required errors={errors} />}
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
