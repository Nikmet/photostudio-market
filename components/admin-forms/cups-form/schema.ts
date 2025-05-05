import { z } from "zod";

export const formSchemaCups = z.object({
    name: z.string().min(2, "Название должно быть больше 2 символов"),
    printing_image: z
        .instanceof(File)
        .refine(file => file.size === 0 || file.type.startsWith("image/"), { message: "Неверный формат изображения" })
        .refine(file => file.size < 1000000, { message: "Размер изображения не должен превышать 4MB" })
        .optional(),
    comment: z.string().optional()
});

export type FormValuesCups = z.infer<typeof formSchemaCups>;
