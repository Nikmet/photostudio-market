"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui";
import { AdminSelect } from "@/components/admin-components/admin-select";
import { magnetTypes } from "@/@types/enums";
import { onNumberValueChange } from "@/lib/inputs";
import { ImageInput } from "@/components/inputs/image-input";
import { FormInput } from "@/components/inputs/form-input";
import { useSession } from "next-auth/react";
import { formSchemaMagnet, FormValuesMagnet } from "../admin-forms/magnets-form/schema";
import { cn } from "@/lib";

export interface IMagnetsFormProps {
    defaultValues?: FormValuesMagnet;
    onSubmit: (data: FormValuesMagnet, userId: string) => void;
    className?: string;
    id: string;
}

export const MagnetsClientForm = ({ onSubmit, defaultValues, id, className }: IMagnetsFormProps): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormValuesMagnet>({
        resolver: zodResolver(formSchemaMagnet),
        defaultValues: defaultValues || {
            name: ""
        }
    });

    const session = useSession();

    setValue("name", `Магнитик | ${id}`);

    const submitAction = (data: FormValuesMagnet) => {
        try {
            onSubmit(data, session.data?.user.id);
            toast.success(`Магнитик "${data.name}" добавлен в корзину!`);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={cn(className, "flex gap-4 flex-col xl:flex-row")}>
            <form
                onSubmit={handleSubmit(submitAction)}
                className="flex flex-col items-center xl:items-start xl:w-[600px] gap-2"
            >
                <Controller
                    name="printing_image"
                    control={control}
                    render={({ field }) => (
                        <ImageInput
                            {...field}
                            label="Изображение"
                            errors={errors}
                            onChange={file => field.onChange(file)}
                        />
                    )}
                />
                <Controller
                    name="width"
                    control={control}
                    render={({ field: { onChange, ...field } }) => (
                        <FormInput
                            type="number"
                            label="Ширина (мм)"
                            {...field}
                            onChange={e => onNumberValueChange(e, onChange)}
                            errors={errors}
                            required
                            className="lg:w-[500px] w-[300px]"
                        />
                    )}
                />
                <Controller
                    name="height"
                    control={control}
                    render={({ field: { onChange, ...field } }) => (
                        <FormInput
                            type="number"
                            label="Высота (мм)"
                            {...field}
                            onChange={e => onNumberValueChange(e, onChange)}
                            errors={errors}
                            required
                            className="lg:w-[500px] w-[300px]"
                        />
                    )}
                />
                <AdminSelect
                    name="magnet_type"
                    value={watch("magnet_type")}
                    onChange={value => setValue("magnet_type", value)}
                    label="Тип магнита"
                    items={magnetTypes}
                    className="lg:w-[500px] w-[300px]"
                    defaultValue={defaultValues?.magnet_type}
                    errors={errors}
                    required
                />
                <Button className="lg:w-[500px] w-[300px] mt-5" type="submit">
                    Добавить в корзину
                </Button>
            </form>

            <div className="mt-7 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg shadow-lg border dark:border-slate-700 border-blue-200 mr-4">
                <h3 className="mb-5 font-semibold text-2xl dark:text-blue-300 text-blue-900 border-b dark:border-slate-600 border-blue-300 pb-3">
                    Описание
                </h3>
                <div className="dark:text-slate-300 text-slate-700 leading-relaxed space-y-4">
                    <span className="block mb-4">
                        Персонализированные магнитики — это не только стильное украшение для холодильника или офисной
                        доски, но и оригинальный сувенир, рекламный носитель или подарок.
                    </span>

                    <span className="block mb-4">
                        <strong className="dark:text-blue-300 text-blue-900">Характеристики:</strong>
                        <ul className="list-disc ml-6 mt-2 marker:text-blue-600 dark:marker:text-blue-300">
                            <li>Материалы: акрил или пластиковая подложка</li>
                            <li>Форма и размер: произвольные параметры под заказ</li>
                            <li>Печать: яркая полноцветная с защитной ламинацией</li>
                        </ul>
                    </span>

                    <span className="block mb-4">
                        <strong className="dark:text-blue-300 text-blue-900">Преимущества:</strong>
                        <ul className="list-disc ml-6 mt-2 marker:text-blue-600 dark:marker:text-blue-300">
                            <li>Индивидуальный дизайн под любой повод</li>
                            <li>Долговечные материалы и насыщенная печать</li>
                            <li>Недорогой, но запоминающийся сувенир</li>
                            <li>Идеальны для бизнеса, мероприятий и подарков</li>
                        </ul>
                    </span>

                    <span className="block mb-4">
                        <strong className="dark:text-blue-300 text-blue-900">Применение:</strong>
                        <ul className="list-disc ml-6 mt-2 marker:text-blue-600 dark:marker:text-blue-300">
                            <li>Корпоративные сувениры</li>
                            <li>Магниты на свадьбу, день рождения, выпускной</li>
                            <li>Городские и туристические сувениры</li>
                            <li>Продукция с логотипом для рекламы</li>
                        </ul>
                    </span>
                </div>
            </div>
        </div>
    );
};
