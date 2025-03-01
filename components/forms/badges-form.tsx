"use client";

import { FormInput } from "../form-input";
import { Button } from "@/components/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

export interface IBadgesFormProps {
    defaultValues?: FormValuesBadges;
    onSubmit: (data: FormValuesBadges) => void;
    className?: string;
}

const formSchema = z.object({
    name: z.string().min(2, "Название должно быть больше 2 символов")
});

export type FormValuesBadges = z.infer<typeof formSchema>;

export const BadgesForm = ({ onSubmit, defaultValues, className }: IBadgesFormProps): React.JSX.Element => {
    const form = useForm<FormValuesBadges>({
        resolver: zodResolver(formSchema),
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
                    <FormInput
                        type="text"
                        label="Название"
                        defaultValue={defaultValues?.name}
                        {...form.register("name")}
                        errors={form.formState.errors}
                        required
                    />
                    <Button type="submit">{defaultValues ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
};
