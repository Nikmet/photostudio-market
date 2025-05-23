"use client";

import { Button } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ImageInput } from "@/components/inputs/image-input";
import { formSchemaCups, FormValuesCups } from "../admin-forms/cups-form/schema";
import { useSession } from "next-auth/react";
import { FormTextarea } from "../inputs/form-textarea";
import { ShoppingBasket } from "lucide-react";

export interface ICupsFormProps {
    onSubmit: (data: FormValuesCups, userId: string) => void;
    className?: string;
    id: string;
}

export const CupsClientForm = ({ onSubmit, id, className }: ICupsFormProps): React.JSX.Element => {
    const form = useForm<FormValuesCups>({
        resolver: zodResolver(formSchemaCups)
    });

    const session = useSession();

    form.setValue("name", `Кружка | ${id}`);

    const submitAction = (data: FormValuesCups) => {
        try {
            onSubmit(data, session.data?.user.id);
            toast.success(`Кружка "${data.name}" добавлена в корзину!`);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={className}>
            <form
                encType="multipart/form-data"
                onSubmit={form.handleSubmit(submitAction)}
                className="flex flex-col 2xl:flex-row gap-5"
            >
                <div className="flex flex-col items-center lg:items-start lg:w-[500px] gap-2">
                    <Controller
                        name="printing_image"
                        control={form.control}
                        render={({ field }) => (
                            <ImageInput
                                {...field}
                                label="Изображение"
                                errors={form.formState.errors}
                                onChange={file => field.onChange(file)}
                            />
                        )}
                    />
                    <Controller
                        name="comment"
                        control={form.control}
                        render={({ field }) => (
                            <FormTextarea
                                label="Комментарий"
                                errors={form.formState.errors}
                                {...field}
                                className="lg:w-[500px] w-[300px]"
                            />
                        )}
                    />
                </div>

                <div className="lg:w-[600px]">
                    <h3 className="mb-5 font-semibold text-2xl dark:text-blue-300 text-indigo-800 border-b dark:border-gray-600 border-blue-200 pb-3">
                        Описание
                    </h3>
                    <div className="dark:text-gray-300 text-gray-700 leading-relaxed space-y-4">
                        <span className="block mb-4">
                            Создайте уют и подчеркните стиль с нашей керамической кружкой с индивидуальным дизайном. Она
                            станет не только практичным предметом быта, но и оригинальным элементом корпоративной
                            культуры или запоминающимся сувениром.
                        </span>

                        <span className="block mb-4">
                            <strong className="dark:text-blue-300 text-indigo-800">Характеристики:</strong>
                            <ul className="list-disc ml-6 mt-2 marker:text-primary dark:marker:text-blue-300">
                                <li>Материал: прочная белая керамика высокого качества</li>
                                <li>Объём: 330 мл — оптимальный размер для чая, кофе, какао или других напитков</li>
                                <li>Размеры: высота — 95 мм, диаметр — 80 мм</li>
                                <li>Печать: яркое полноцветное изображение методом сублимационной печати</li>
                                <li>Стойкость к выцветанию: изображение не теряет насыщенности со временем</li>
                                <li>Уход: подходит для мытья в посудомоечной машине и использования в микроволновке</li>
                                <li>Ручка: эргономичная форма — удобно держать даже наполненную кружку</li>
                            </ul>
                        </span>
                        <span className="block mb-4">
                            <strong className="dark:text-blue-300 text-indigo-800">Применение:</strong>
                            <ul className="list-disc ml-6 mt-2 marker:text-primary dark:marker:text-blue-300">
                                <li>Корпоративные подарки</li>
                                <li>Рекламные акции и мероприятия</li>
                                <li>Сувениры с символикой города или компании</li>
                                <li>Личная кружка с фото, цитатой или любимым персонажем</li>
                            </ul>
                        </span>
                    </div>
                    <Button className="lg:w-[500px] w-full mt-5" type="submit">
                        <ShoppingBasket /> <span>Добавить в корзину</span>
                    </Button>
                </div>
            </form>
        </div>
    );
};
