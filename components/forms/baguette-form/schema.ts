import { imageSchema } from "@/@types/image-schema";
import { z } from "zod";

export const formSchemaBaguette = z.object({
    price: z.number().min(1, "Цена должна быть больше 0"),
    serial_number: z.string().min(1, "Серийный номер должен быть заполнен"),
    image: imageSchema.optional()
});

export type FormValuesBaguette = z.infer<typeof formSchemaBaguette>;
