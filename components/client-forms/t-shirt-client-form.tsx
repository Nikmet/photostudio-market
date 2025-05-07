"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AdminSelect } from "@/components/admin-components/admin-select";
import { printingSides, sizes } from "@/@types/enums";
import { Button } from "@/components/ui";
import { ImageInput } from "@/components/inputs/image-input";
import { useSession } from "next-auth/react";
import { formSchemaTShirts, FormValuesTShirts } from "../admin-forms/t-shirts-form/schema";
import { FormTextarea } from "../inputs/form-textarea";
import { ShoppingBasket } from "lucide-react";

export interface ITShirtsFormProps {
    className?: string;
    defaultValues?: FormValuesTShirts;
    onSubmit: (data: FormValuesTShirts, userId: string) => void;
    id: string;
}

export const TShirtsClientForm = ({ onSubmit, defaultValues, id, className }: ITShirtsFormProps): React.JSX.Element => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormValuesTShirts>({
        resolver: zodResolver(formSchemaTShirts),
        defaultValues: defaultValues || {
            name: "",
            printing_image: undefined
        }
    });

    const session = useSession();

    setValue("name", `Футболка | ${id}`);

    const submitAction = (data: FormValuesTShirts) => {
        try {
            onSubmit(data, session.data?.user.id);
            toast.success(`Футболка "${data.name}" добавлена в корзину!`);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={className}>
            <form
                encType="multipart/form-data"
                onSubmit={handleSubmit(submitAction)}
                className="flex flex-col 2xl:flex-row gap-5"
            >
                <div className="flex flex-col items-center lg:items-start lg:w-[500px] gap-2">
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
                    <AdminSelect
                        name="printing_side"
                        value={watch("printingSide")}
                        onChange={value => setValue("printingSide", value)}
                        label="Стороны печати"
                        className="lg:w-[500px] w-[300px]"
                        items={printingSides}
                        defaultValue={defaultValues?.printingSide}
                        errors={errors}
                        required
                    />
                    <AdminSelect
                        name="size"
                        label="Размер"
                        value={watch("size")}
                        onChange={value => setValue("size", value)}
                        className="lg:w-[500px] w-[300px]"
                        items={sizes}
                        defaultValue={defaultValues?.size}
                        errors={errors}
                        required
                    />
                    <Controller
                        name="comment"
                        control={control}
                        render={({ field }) => (
                            <FormTextarea
                                label="Комментарий"
                                errors={errors}
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
                            Стильная футболка с возможностью индивидуальной печати. Идеальный выбор для повседневной
                            носки, корпоративных мероприятий, рекламных акций и подарков.
                        </span>

                        <span className="block mb-4">
                            <strong className="dark:text-blue-300 text-indigo-800">Характеристики:</strong>
                            <ul className="list-disc ml-6 mt-2 marker:text-primary dark:marker:text-blue-300">
                                <li>Материал: 100% хлопок (возможны варианты с синтетическими добавками)</li>
                                <li>Метод печати: термотрансфер</li>
                                <li>Изображение устойчиво к стирке и выцветанию</li>
                                <li>Доступны размеры от XS до 3XL</li>
                                <li>Варианты печати: на груди, спине или с двух сторон</li>
                            </ul>
                        </span>

                        <span className="block mb-4">
                            <strong className="dark:text-blue-300 text-indigo-800">Преимущества:</strong>
                            <ul className="list-disc ml-6 mt-2 marker:text-primary dark:marker:text-blue-300">
                                <li>Отличная воздухопроницаемость и комфорт в носке</li>
                                <li>Индивидуальный дизайн — выделитесь из толпы</li>
                                <li>Подходит как для повседневного стиля, так и для промо-мероприятий</li>
                                <li>Легко ухаживать — можно стирать в машинке</li>
                            </ul>
                        </span>

                        <span className="block mb-4">
                            <strong className="dark:text-blue-300 text-indigo-800">Применение:</strong>
                            <ul className="list-disc ml-6 mt-2 marker:text-primary dark:marker:text-blue-300">
                                <li>Корпоративная одежда и униформа</li>
                                <li>Рекламные кампании и брендированные подарки</li>
                                <li>Одежда для мероприятий, спортивных команд и кружков</li>
                                <li>Персонализированные подарки с фото или надписями</li>
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
