"use client";

import { Button } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { formSchemaBadges, FormValuesBadges } from "./schema";
import { FormInput } from "@/components/form-input";

export interface IBadgesFormProps {
    defaultValues?: FormValuesBadges;
    onSubmit: (data: FormValuesBadges) => void;
    className?: string;
}

export const BadgesForm = ({ onSubmit, defaultValues, className }: IBadgesFormProps): React.JSX.Element => {
    const form = useForm<FormValuesBadges>({
        resolver: zodResolver(formSchemaBadges),
        defaultValues: defaultValues || {
            name: ""
        }
    });

    const submitAction = (data: FormValuesBadges) => {
        onSubmit(data);
        toast.success(`Значок "${data.name}" успешно сохранен!`);
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
                    <Button type="submit">{defaultValues ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
};
