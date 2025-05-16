"use client";

import { Controller, useForm } from "react-hook-form";
import { formSchemaLEC, FormValuesLEC } from "./schema";
import { onNumberValueChange } from "@/lib/inputs";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AdminSelect } from "@/components/admin-components/admin-select";
import { difficile } from "@/@types/enums";
import { Button } from "@/components/ui";
import { FormInput } from "@/components/inputs/form-input";
import { UseCloseTabOnSubmit } from "@/hooks/use-close-tab-on-submit";

export interface ILecFormProps {
    defaultValues?: FormValuesLEC;
    onSubmit: (data: FormValuesLEC) => void;
    className?: string;
    id: string;
    href: string;
}

export const LecForm = ({ onSubmit, defaultValues, id, href, className }: ILecFormProps): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormValuesLEC>({
        resolver: zodResolver(formSchemaLEC),
        defaultValues: defaultValues || {
            name: ""
        }
    });

    const { closeTab } = UseCloseTabOnSubmit();

    const submitAction = (data: FormValuesLEC) => {
        onSubmit(data);
        closeTab(id, href, "ЛГР");
        toast.success(`ЛГР "${data.name}" успешно сохранена!`);
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(submitAction)} className="flex gap-2">
                <div className="flex flex-col gap-2">
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <FormInput type="text" label="Название" {...field} errors={errors} required />
                        )}
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
                    <AdminSelect
                        name="difficile"
                        value={watch("difficile")}
                        onChange={value => setValue("difficile", value)}
                        label={"Сложность"}
                        items={difficile}
                        defaultValue={defaultValues?.difficile}
                        errors={errors}
                        required
                    />
                    <Button type="submit">{defaultValues ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
};
