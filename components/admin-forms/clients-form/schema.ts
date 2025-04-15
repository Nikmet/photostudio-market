import { z } from "zod";

export const formSchemaClients = z.object({
    fullName: z.string().min(1, "Поле обязательно"),
    phone: z.string().min(18, "Поле обязательно"),
    email: z.string().email("Неверный формат почты"),
    photo: z
        .instanceof(File)
        .refine(file => file.size === 0 || file.type.startsWith("image/"), { message: "Неверный формат изображения" })
        .refine(file => file.size < 1000000, { message: "Размер изображения не должен превышать 4MB" })
        .optional()
});

export type FormValuesClients = z.infer<typeof formSchemaClients>;
