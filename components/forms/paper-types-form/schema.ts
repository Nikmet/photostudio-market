import { z } from "zod";

export const formSchemaPaperTypes = z.object({
    name: z.string().min(2, "Название должно быть больше 2 символов"),
    price: z.number().min(1, "Цена должна быть больше 0")
});

export type FormValuesPaperTypes = z.infer<typeof formSchemaPaperTypes>;
