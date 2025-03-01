"use client";

import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(2, "Название должно быть больше 2 символов")
});

export type FormValuesAddressPlaqueForms = z.infer<typeof formSchema>;

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
    const form = useForm<FormValuesAddressPlaqueForms>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues || {
            name: ""
        }
    });

    return (
        <div className={className}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
                <img
                    src="https://www.adverti.ru/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/4/6/4662_5.jpg"
                    alt="кружка"
                    width={500}
                    height={500}
                    className="rounded-md border border-gray-300"
                />
                <div className="flex gap-2">
                    <Input {...form.register("name")} type="text" placeholder="Название" />
                    {form.formState.errors.name && (
                        <span className="text-red-500">{form.formState.errors.name.message}</span>
                    )}
                    <Button type="submit">{defaultValues ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
};
