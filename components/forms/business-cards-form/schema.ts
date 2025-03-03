import { printingSides } from "@/@types/enums";
import { z } from "zod";

export const formSchemaBusinessCards = z.object({
    name: z.string().min(1, "Поле обязательно"),
    printing_side: z.enum(Object.keys(printingSides) as [string, ...string[]], {
        required_error: "Поле обязательно"
    })
});

export type FormValuesBusinessCards = z.infer<typeof formSchemaBusinessCards>;
