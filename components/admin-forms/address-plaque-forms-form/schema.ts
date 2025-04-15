import { z } from "zod";

export const formSchemaAddressPlaqueForms = z.object({
    name: z.string().min(2, "Название должно быть больше 2 символов"),
    price: z.number().min(1, "Цена должна быть больше 0"),
    height: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    width: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    image: z
        .instanceof(File)
        .refine(file => file.size === 0 || file.type.startsWith("image/"), { message: "Неверный формат изображения" })
        .refine(file => file.size < 1000000, { message: "Размер изображения не должен превышать 4MB" })
        .optional()
});

export type FormValuesAddressPlaqueForms = z.infer<typeof formSchemaAddressPlaqueForms>;
