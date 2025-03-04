import { z } from "zod";

export const formSchemaBaguette = z.object({
    price: z.number().min(1, "Цена должна быть больше 0"),
    serial_number: z.string().min(1, "Серийный номер должен быть заполнен"),
});

export type FormValuesBaguette = z.infer<typeof formSchemaBaguette>;