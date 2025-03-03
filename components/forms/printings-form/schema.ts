import { printingTypes } from "@/@types/enums";
import { z } from "zod";

export const formSchemaPrintings = z.object({
    name: z.string().min(2, "Название должно быть больше 2 символов"),
    printing_type: z.enum(Object.keys(printingTypes) as [string, ...string[]], {
        required_error: "Поле обязательно"
    })
});

export type FormValuesPrintings = z.infer<typeof formSchemaPrintings>;
