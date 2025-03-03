import { magnetTypes } from "@/@types/enums";
import { z } from "zod";

export const formSchemaMagnet = z.object({
    name: z.string().min(2, "Название должно быть больше 2 символов"),
    magnet_type: z.enum(Object.keys(magnetTypes) as [string, ...string[]], {
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

export type FormValuesMagnet = z.infer<typeof formSchemaMagnet>;
