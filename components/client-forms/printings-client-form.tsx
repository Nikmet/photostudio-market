//TODO: Добавить картинки с оснасткой и без

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AdminSelect } from "@/components/admin-components/admin-select";
import { printingTypes } from "@/@types/enums";
import { Button } from "@/components/ui";
import { formSchemaPrintings, FormValuesPrintings } from "../admin-forms/printings-form/schema";
import { useSession } from "next-auth/react";

export interface IPrintingsFormProps {
    defaultValues?: FormValuesPrintings;
    onSubmit: (data: FormValuesPrintings, userId: string) => void;
    className?: string;
    id: string;
}

export const PrintingsClientForm = ({ onSubmit, defaultValues, id, className }: IPrintingsFormProps): React.JSX.Element => {
    const {
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormValuesPrintings>({
        resolver: zodResolver(formSchemaPrintings),
        defaultValues: defaultValues || {
            name: ""
        }
    });

    const session = useSession();

    setValue("name", `Печать | ${id}`);

    const submitAction = (data: FormValuesPrintings) => {
        try {
            onSubmit(data, session.data?.user.id);
            toast.success(`Печать "${data.name}" добавлена в корзину!`);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(submitAction)} className="flex gap-2">
                <div className="flex gap-2">
                    <div className="flex flex-col gap-2">
                        <AdminSelect
                            name="printing_type"
                            value={watch("printing_type")}
                            onChange={value => setValue("printing_type", value)}
                            label="Тип печати"
                            items={printingTypes}
                            defaultValue={defaultValues?.printing_type}
                            errors={errors}
                            required
                        />
                        <Button type="submit">Добавить в корзину</Button>
                    </div>
                </div>
            </form>
        </div>
    );
};
