//TODO: Добавить картинки с оснасткой и без
//TODO: Комментарий

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

export const PrintingsClientForm = ({
    onSubmit,
    defaultValues,
    id,
    className
}: IPrintingsFormProps): React.JSX.Element => {
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
            <form onSubmit={handleSubmit(submitAction)} className="flex gap-2 w-[300px] lg:w-[600px] flex-col">
                <div className="lg:w-[600px]">
                    <h3 className="mb-5 font-semibold text-2xl dark:text-blue-300 text-blue-900">Описание</h3>
                    <div className="dark:text-slate-300 text-slate-700 leading-relaxed space-y-4">
                        <span className="block mb-4">
                            Профессиональные печати для документов — важный атрибут юридической и деловой деятельности,
                            обеспечивающий подлинность и официальный статус ваших бумаг.
                        </span>

                        <span className="block mb-4">
                            <strong className="dark:text-blue-300 text-blue-900">Характеристики:</strong>
                            <ul className="list-disc ml-6 mt-2 marker:text-blue-600 dark:marker:text-blue-300">
                                <li>Типы: с оснасткой и без</li>
                                <li>Материалы: дерево, автоматические оснастки</li>
                                <li>
                                    Оснастка: пластиковая, металлическая, с автоматической подачей штемпельной краски
                                </li>
                                <li>Размеры: стандартные (Ø40-45 мм) и индивидуальные под заказ</li>
                            </ul>
                        </span>
                        <span className="block mb-4">
                            <strong className="dark:text-blue-300 text-blue-900">Применение:</strong>
                            <ul className="list-disc ml-6 mt-2 marker:text-blue-600 dark:marker:text-blue-300">
                                <li>Официальные документы организаций и ИП</li>
                                <li>Бухгалтерская и юридическая документация</li>
                                <li>Медицинские учреждения и образовательные организации</li>
                                <li>Договоры, акты и прочая деловая корреспонденция</li>
                                <li>Внутренние документы компаний</li>
                            </ul>
                        </span>
                    </div>
                </div>
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
                <Button className="lg:w-full w-[300px]" type="submit">
                    Добавить в корзину
                </Button>
            </form>
        </div>
    );
};
