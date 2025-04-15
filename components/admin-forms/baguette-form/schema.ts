import { z } from "zod";

export const formSchemaBaguette = z.object({
    price: z.number().min(1, "Цена должна быть больше 0"),
    serial_number: z.string().min(1, "Серийный номер должен быть заполнен"),
    image: z
        .instanceof(File)
        .refine(file => file.size === 0 || file.type.startsWith("image/"), { message: "Неверный формат изображения" })
        .refine(file => file.size < 4000000, { message: "Размер изображения не должен превышать 4MB" })
        .optional()
});

export type FormValuesBaguette = z.infer<typeof formSchemaBaguette>;
