"use client";

import { Controller, useForm } from "react-hook-form";
import { formSchemaProducts, FormValuesProducts } from "./schema";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminSelect } from "@/components/admin-select";
import { difficile } from "@/@types/enums";
import { AdminCheckbox } from "@/components/admin-checkbox";
import { FormTextarea } from "@/components/form-textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";

export interface IProductFormProps {
    defaultValues?: FormValuesProducts;
    onSubmit: (data: FormValuesProducts) => void;
    className?: string;
    category?: string;
    itemId?: string;
    itemName?: string;
    route?: string;
    price?: string;
}

export const ProductForm = ({
    onSubmit,
    defaultValues,
    category,
    itemId,
    itemName,
    route,
    price,
    className
}: IProductFormProps): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormValuesProducts>({
        resolver: zodResolver(formSchemaProducts),
        defaultValues: defaultValues
    });
    const router = useRouter();

    const submitAction = (data: FormValuesProducts) => {
        onSubmit(data);
        toast.success(`Печать "${itemName}" успешно сохранена!`);
    };

    const linkIn = () => {
        router.push(`/admin/${route}/${itemId}`);
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(submitAction)}>
                <div>
                    <div className="font-medium mb-2">Имя продукта</div>
                    <Input value={itemName} disabled />
                </div>
                <div>
                    <div className="font-medium mb-2">Категория</div>
                    <Input value={category} disabled />
                </div>
                <div>
                    <div className="font-medium mb-2">Номер продукта</div>
                    <Input value={itemId} disabled />
                </div>

                <Controller
                    name="design"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                        <AdminCheckbox
                            {...field}
                            checked={value} // Передаем значение
                            onChange={onChange} // Передаем обработчик
                            label="Наличие дизайна"
                        />
                    )}
                />
                <AdminSelect
                    name="design_difficulty"
                    value={watch("design_difficulty")}
                    onChange={value => setValue("design_difficulty", value)}
                    label={"Сложность"}
                    items={difficile}
                    defaultValue={defaultValues?.design_difficulty}
                    errors={errors}
                />
                <Controller
                    name="comment"
                    control={control}
                    render={({ field }) => <FormTextarea label="Комментарий" errors={errors} {...field} />}
                />
                <div>
                    <div className="font-medium mb-2">Сумма</div>
                    <Input value={price} disabled />
                </div>
            </form>
            <Button type="submit">Сохранить</Button>
            <Button variant={"outline"} onClick={linkIn}>
                Перейти к продукту
            </Button>
        </div>
    );
};
