import { printingSides } from "@/@types/enums";
import { z } from "zod";

export const formSchemaBusinessCards = z.object({
    name: z.string().min(1, "Поле обязательно"),
    printing_side: z.enum(Object.keys(printingSides) as [string, ...string[]], {
        required_error: "Поле обязательно"
    }),
    printing_image: z
        .instanceof(File)
        .refine(file => file.size === 0 || file.type.startsWith("image/"), { message: "Неверный формат изображения" })
        .refine(file => file.size < 4000000, { message: "Размер изображения не должен превышать 4MB" })
        .optional()
});

export type FormValuesBusinessCards = z.infer<typeof formSchemaBusinessCards>;
