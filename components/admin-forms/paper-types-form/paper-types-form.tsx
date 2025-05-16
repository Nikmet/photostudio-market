"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { formSchemaPaperTypes, FormValuesPaperTypes } from "./schema";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui";
import { onNumberValueChange } from "@/lib/inputs";
import { FormInput } from "@/components/inputs/form-input";
import { UseCloseTabOnSubmit } from "@/hooks/use-close-tab-on-submit";

export interface IPaperTypesFormProps {
    defaultValues?: FormValuesPaperTypes;
    onSubmit: (data: FormValuesPaperTypes) => void;
    className?: string;
    id: string;
    href: string;
}

export const PaperTypesForm = ({
    onSubmit,
    defaultValues,
    href,
    id,
    className
}: IPaperTypesFormProps): React.JSX.Element => {
    const form = useForm<FormValuesPaperTypes>({
        resolver: zodResolver(formSchemaPaperTypes),
        defaultValues: defaultValues || {
            name: ""
        }
    });

    const { closeTab } = UseCloseTabOnSubmit();

    const submitAction = (data: FormValuesPaperTypes) => {
        onSubmit(data);
        closeTab(id, href, "Типы бумаги");
        toast.success(`Тип бумаги "${data.name}" успешно сохранен!`);
    };

    return (
        <div className={className}>
            <form onSubmit={form.handleSubmit(submitAction)} className="flex gap-2">
                <img
                    src="https://www.adverti.ru/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/4/6/4662_5.jpg"
                    alt="кружка"
                    width={500}
                    height={500}
                    className="rounded-md border border-gray-300"
                />
                <div className="flex gap-2">
                    <Controller
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormInput
                                type="text"
                                label="Название"
                                {...field}
                                errors={form.formState.errors}
                                required
                            />
                        )}
                    />
                    <Controller
                        name="price"
                        control={form.control}
                        render={({ field: { onChange, ...field } }) => (
                            <FormInput
                                type="number"
                                label="Цена за м²"
                                onChange={e => onNumberValueChange(e, onChange)}
                                errors={form.formState.errors}
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
