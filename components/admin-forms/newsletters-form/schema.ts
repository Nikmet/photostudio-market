import { z } from "zod";

export const formSchemaNewsletters = z.object({
    name: z.string().min(2, "Название должно быть больше 2 символов"),
    height: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    width: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    colorId: z.string().min(1, "Выберите цвет"),
    printing_image: z
        .instanceof(File)
        .refine(file => file.size === 0 || file.type.startsWith("image/"), { message: "Неверный формат изображения" })
        .refine(file => file.size < 1000000, { message: "Размер изображения не должен превышать 4MB" })
        .optional(),
    comment: z.string().optional()
});

export type FormValuesNewsletters = z.infer<typeof formSchemaNewsletters>;
