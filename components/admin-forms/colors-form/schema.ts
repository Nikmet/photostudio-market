import { z } from "zod";

export const formSchemaColors = z.object({
    name: z.string().min(1, "Поле обязательно"),
    rgb: z.string().min(1, "Поле обязательно"),
    price: z.number().min(1, "Цена должна быть больше 0")
});

export type FormValuesColors = z.infer<typeof formSchemaColors>;
