"use client";

import { FormInput } from "../form-input";
import { Button } from "@/components/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

export interface IBaguetteFormProps {
    defaultValues?: FormValuesBaguette;
    onSubmit: (data: FormValuesBaguette) => void;
    className?: string;
}

const formSchema = z.object({
    price: z.number().min(1, "Цена должна быть больше 0")
});

export type FormValuesBaguette = z.infer<typeof formSchema>;

export const BaguetteForm = ({ onSubmit, defaultValues, className }: IBaguetteFormProps): React.JSX.Element => {
    const form = useForm<FormValuesBaguette>({
        resolver: zodResolver(formSchema),
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
                    <FormInput
                        type="number"
                        label="Цена за метр"
                        defaultValue={defaultValues?.price}
                        {...form.register("price")}
                        errors={form.formState.errors}
                        required
                    />
                    <Button type="submit">{defaultValues ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
};
