import { printingSides } from "@/@types/enums";
import { imageSchema } from "@/@types/image-schema";
import { z } from "zod";

export const formSchemaBusinessCards = z.object({
    name: z.string().min(1, "Поле обязательно"),
    printing_side: z.enum(Object.keys(printingSides) as [string, ...string[]], {
        required_error: "Поле обязательно"
    }),
    printing_image: imageSchema.optional()
});

export type FormValuesBusinessCards = z.infer<typeof formSchemaBusinessCards>;
