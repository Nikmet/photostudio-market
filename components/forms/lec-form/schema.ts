import { difficile } from "@/@types/enums";
import { z } from "zod";

export const formSchemaLEC = z.object({
    name: z.string().min(2, "Название должно быть больше 2 символов"),
    difficile: z.enum(Object.keys(difficile) as [string, ...string[]], {
        required_error: "Поле обязательно" 
    }),
    height: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    width: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    })
});

export type FormValuesLEC = z.infer<typeof formSchemaLEC>;
