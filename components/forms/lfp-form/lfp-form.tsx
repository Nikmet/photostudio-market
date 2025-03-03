"use client";

import { Controller, useForm } from "react-hook-form";
import { formSchemaLFP, FormValuesLFP } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FormInput } from "@/components/form-input";
import { onNumberValueChange } from "@/lib/inputs";
import { AdminSelect } from "@/components/admin-select";
import { PaperType } from "@prisma/client";
import { Button } from "@/components/ui";

export interface ILfpFormProps {
    defaultValues?: FormValuesLFP;
    onSubmit: (data: FormValuesLFP) => void;
    className?: string;
    paperTypes: PaperType[];
}

export const LfpForm = ({ onSubmit, defaultValues, paperTypes, className }: ILfpFormProps): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormValuesLFP>({
        resolver: zodResolver(formSchemaLFP),
        defaultValues: defaultValues || {
            name: ""
        }
    });

    const submitAction = (data: FormValuesLFP) => {
        onSubmit(data);
        toast.success(`ШФП "${data.name}" успешно сохранена!`);
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
                        name="paper_type"
                        value={watch("paper_type_id")}
                        onChange={value => setValue("paper_type_id", value)}
                        route="paper-types"
                        label={"Тип бумаги"}
                        items={{
                            ...Object.fromEntries(paperTypes.map(type => [type.id, type.name]))
                        }}
                        defaultValue={defaultValues?.paper_type_id}
                        errors={errors}
                        required
                    />
                    <Button type="submit">{defaultValues ? "Сохранить" : "Создать"}</Button>
                </div>
            </form>
        </div>
    );
};
