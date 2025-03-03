"use client";

import { FormInput } from "../../form-input";
import { Button } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { formSchemaBaguette, FormValuesBaguette } from "./schema";

export interface IBaguetteFormProps {
    defaultValues?: FormValuesBaguette;
    onSubmit: (data: FormValuesBaguette) => void;
    className?: string;
}

export const BaguetteForm = ({ onSubmit, defaultValues, className }: IBaguetteFormProps): React.JSX.Element => {
    const form = useForm<FormValuesBaguette>({
        resolver: zodResolver(formSchemaBaguette),
        defaultValues: defaultValues || {
            price: 0
        }
    });

    const submitAction = (data: FormValuesBaguette) => {
        onSubmit(data);
        toast.success(`Багет успешно сохранен!`);
    };

    return (
        <div className={className}>
            <form onSubmit={form.handleSubmit(submitAction)} className="flex gap-2">
                <div className="flex gap-2">
                    <Controller
                        name="price"
                        control={form.control}
                        render={({ field }) => (
                            <FormInput
                                type="number"
                                label="Цена за метр"
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
