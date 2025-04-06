import { magnetTypes } from "@/@types/enums";
import { z } from "zod";

export const formSchemaMagnet = z.object({
    name: z.string().min(2, "Название должно быть больше 2 символов"),
    magnet_type: z.enum(Object.keys(magnetTypes) as [string, ...string[]], {
        required_error: "Поле обязательно"
    }),
    height: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    width: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    printing_image: z
        .instanceof(File)
        .refine(file => file.size === 0 || file.type.startsWith("image/"), { message: "Неверный формат изображения" })
        .refine(file => file.size < 4000000, { message: "Размер изображения не должен превышать 4MB" })
        .optional()
});

export type FormValuesMagnet = z.infer<typeof formSchemaMagnet>;
