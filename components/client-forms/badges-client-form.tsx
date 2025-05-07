//TODO: Комментарий

"use client";

import { Button } from "@/components/ui";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ImageInput } from "@/components/inputs/image-input";
import { formSchemaBadges, FormValuesBadges } from "../admin-forms/badges-form/schema";
import { useSession } from "next-auth/react";
import { ShoppingBasket } from "lucide-react";

export interface IBadgesFormProps {
    defaultValues?: FormValuesBadges;
    onSubmit: (data: FormValuesBadges, userId: string) => void;
    className?: string;
    id: string;
}

export const BadgesClientForm = ({ onSubmit, defaultValues, id, className }: IBadgesFormProps): React.JSX.Element => {
    const form = useForm<FormValuesBadges>({
        resolver: zodResolver(formSchemaBadges),
        defaultValues: defaultValues || {
            name: ""
        }
    });

    const session = useSession();

    form.setValue("name", `Значок | ${id}`);

    const submitAction = (data: FormValuesBadges) => {
        try {
            onSubmit(data, session.data?.user.id);
            toast.success(`Значок "${data.name}" добавлен в корзину!`);
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
                                onChange={file => field.onChange(file)} // Передаем файл в форму
                            />
                        )}
                    />
                </div>
                <div className="lg:w-[600px]">
                    <h3 className="mb-5 font-semibold text-2xl dark:text-blue-300 text-blue-900">Описание</h3>
                    <div className="dark:text-slate-300 text-slate-700 leading-relaxed space-y-4">
                        <span className="block mb-4">
                            Персонализированные значки — это стильный аксессуар, который дополнит ваш образ, станет
                            частью корпоративного стиля или оригинальным подарком.
                        </span>

                        <span className="block mb-4">
                            <strong className="dark:text-blue-300 text-blue-900">Характеристики:</strong>
                            <ul className="list-disc ml-6 mt-2 marker:text-blue-600 dark:marker:text-blue-300">
                                <li>Материалы: металлическая основа, пластик или мягкий акрил</li>
                                <li>Форма и размер: круглые, квадратные, фигурные — любые параметры под заказ</li>
                                <li>Крепление: надёжная булавка или безопасный зажим</li>
                                <li>Печать: стойкая полноцветная с защитным покрытием</li>
                            </ul>
                        </span>
                        <span className="block mb-4">
                            <strong className="dark:text-blue-300 text-blue-900">Применение:</strong>
                            <ul className="list-disc ml-6 mt-2 marker:text-blue-600 dark:marker:text-blue-300">
                                <li>Фирменная атрибутика для сотрудников</li>
                                <li>Аксессуары для мероприятий: конференций, фестивалей, свадеб</li>
                                <li>Сувениры с символикой городов, университетов, брендов</li>
                                <li>Коллекционные значки и элементы декора</li>
                            </ul>
                        </span>
                        <Button className="lg:w-[500px] w-full mt-5" type="submit">
                            <ShoppingBasket /> <span>Добавить в корзину</span>
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};
