"use client";

import { Controller, useForm } from "react-hook-form";
import { formSchemaPromoCode, FormValuesPromoCode } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Button } from "@/components/ui";
import { FormInput } from "@/components/inputs/form-input";
import { onNumberValueChange } from "@/lib/inputs";
import { LinkButton } from "@/components/inputs/link-button";

export interface IPromoCodesFormProps {
    className?: string;
    defaultValues?: FormValuesPromoCode;
    onSubmit: (data: FormValuesPromoCode) => void;
}

export const PromoCodesForm = ({ onSubmit, defaultValues, className }: IPromoCodesFormProps): React.JSX.Element => {
    const form = useForm<FormValuesPromoCode>({
        resolver: zodResolver(formSchemaPromoCode),
        defaultValues: defaultValues || {
            code: ""
        }
    });

    const submitAction = (data: FormValuesPromoCode) => {
        try {
            onSubmit(data);
            toast.success(`Промокод "${data.code}" успешно сохранен!`);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={className}>
            <form encType="multipart/form-data" onSubmit={form.handleSubmit(submitAction)} className="flex gap-2">
                <div className="flex gap-2 flex-col w-[300px]">
                    <Controller
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormInput
                                type="text"
                                label="Промокод"
                                {...field}
                                errors={form.formState.errors}
                                required
                            />
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="discount"
                        render={({ field: { onChange, ...field } }) => (
                            <FormInput
                                type="number"
                                label="Скидка"
                                onChange={e => onNumberValueChange(e, onChange)}
                                {...field}
                                errors={form.formState.errors}
                                required
                            />
                        )}
                    />
                    <LinkButton href="/admin/promo" name="Промо-страницы" text="Создать банер для промокода" />
                    <Button type="submit">{defaultValues ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
};
