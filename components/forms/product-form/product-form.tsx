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
import { LinkButton } from "@/components/link-button";
import { FormInput } from "@/components/form-input";
import { onNumberValueChange } from "@/lib/inputs";

export interface IProductFormProps {
    defaultValues?: FormValuesProducts;
    onSubmit: (data: FormValuesProducts) => void;
    className?: string;
    category?: string;
    itemId?: string;
    itemName?: string;
    route?: string;
}

export const ProductForm = ({
    onSubmit,
    defaultValues,
    category,
    itemId,
    itemName,
    route,
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

    const calcPriceWithDifficulty = (price: number) => {
        const difficulty = watch("design_difficulty");

        if (difficulty === "EASY") {
            return price + price * 0.2;
        }

        if (difficulty === "MEDIUM") {
            return price + price * 0.5;
        }

        if (difficulty === "HARD") {
            return price + price * 0.8;
        }
        return 0;
    };

    const onChangePrice = () => {
        const isDesigned = watch("design");

        if (defaultValues?.price) {
            if (isDesigned) {
                setValue("price", calcPriceWithDifficulty(Number(defaultValues.price)).toFixed(2));
            } else {
                setValue("price", defaultValues.price);
            }
        }
    };

    const submitAction = (data: FormValuesProducts) => {
        onSubmit(data);
        toast.success(`Печать "${itemName}" успешно сохранена!`);
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit(submitAction)} className="flex gap-2 flex-col w-[500px] mb-4">
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
                            onChange={() => {
                                onChange(!value);
                                onChangePrice();
                            }} // Передаем обработчик
                            label="Наличие дизайна"
                        />
                    )}
                />
                <AdminSelect
                    name="design_difficulty"
                    value={watch("design_difficulty")}
                    onChange={value => {
                        setValue("design_difficulty", value);
                        onChangePrice();
                    }}
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
                <Controller
                    name="price"
                    control={control}
                    render={({ field: { onChange, ...field } }) => (
                        <FormInput
                            type="number"
                            label="Цена"
                            {...field}
                            onChange={e => onNumberValueChange(e, onChange)}
                            errors={errors}
                            required
                            disabled
                        />
                    )}
                />
                <div className="flex gap-2 mt-2">
                    <Button type="submit">Сохранить</Button>
                    <LinkButton href={`/admin/${route}/${itemId}`} name={itemId} text="Перейти к продукту" />
                </div>
            </form>
        </div>
    );
};
