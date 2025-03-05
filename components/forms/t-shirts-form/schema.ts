import { printingSides, sizes } from "@/@types/enums";
import { imageSchema } from "@/@types/image-schema";
import { z } from "zod";

export const formSchemaTShirts = z.object({
    name: z.string().min(2, "Название должно быть больше 2 символов"),
    printingSide: z.enum(Object.keys(printingSides) as [string, ...string[]], {
        required_error: "Поле обязательно"
    }),
    size: z.enum(Object.keys(sizes) as [string, ...string[]], {
        required_error: "Поле обязательно"
    }),
    printing_image: imageSchema.optional()
});

export type FormValuesTShirts = z.infer<typeof formSchemaTShirts>;
