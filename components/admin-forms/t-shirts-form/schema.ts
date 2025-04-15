import { printingSides, sizes } from "@/@types/enums";
import { z } from "zod";

export const formSchemaTShirts = z.object({
    name: z.string().min(2, "Название должно быть больше 2 символов"),
    printingSide: z.enum(Object.keys(printingSides) as [string, ...string[]], {
        required_error: "Поле обязательно"
    }),
    size: z.enum(Object.keys(sizes) as [string, ...string[]], {
        required_error: "Поле обязательно"
    }),
    printing_image: z
        .instanceof(File)
        .refine(file => file.size === 0 || file.type.startsWith("image/"), { message: "Неверный формат изображения" })
        .refine(file => file.size < 1000000, { message: "Размер изображения не должен превышать 4MB" })
        .optional()
});

export type FormValuesTShirts = z.infer<typeof formSchemaTShirts>;
