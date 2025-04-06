import { BannerDensity } from "@prisma/client";
import { z } from "zod";

export const formSchemaBanners = z.object({
    name: z.string().min(1, "Поле обязательно"), // Кастомное сообщение для обязательного поля
    density: z.enum(Object.values(BannerDensity) as [string, ...string[]], {
        required_error: "Поле обязательно" // Кастомное сообщение для обязательного поля
    }),
    height: z.number({
        required_error: "Поле обязательно", // Кастомное сообщение для обязательного поля
        invalid_type_error: "Значение должно быть числом"
    }),
    width: z.number({
        required_error: "Поле обязательно", // Кастомное сообщение для обязательного поля
        invalid_type_error: "Значение должно быть числом"
    }),
    luvers_count: z.number({
        required_error: "Поле обязательно", // Кастомное сообщение для обязательного поля
        invalid_type_error: "Значение должно быть числом"
    }),
    luvers_step: z.number({
        required_error: "Поле обязательно", // Кастомное сообщение для обязательного поля
        invalid_type_error: "Значение должно быть числом"
    }),
    printing_image: z
        .instanceof(File)
        .refine(file => file.size === 0 || file.type.startsWith("image/"), { message: "Неверный формат изображения" })
        .refine(file => file.size < 4000000, { message: "Размер изображения не должен превышать 4MB" })
        .optional()
});

export type FormValuesBanner = z.infer<typeof formSchemaBanners>;
