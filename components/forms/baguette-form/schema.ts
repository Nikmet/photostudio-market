import { z } from "zod";

export const formSchemaBaguette = z.object({
    price: z.number().min(1, "Цена должна быть больше 0")
});

export type FormValuesBaguette = z.infer<typeof formSchemaBaguette>;