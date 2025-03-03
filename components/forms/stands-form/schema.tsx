import { z } from "zod";

export const formSchemaStands = z.object({
    name: z.string().min(2, "Название должно быть больше 2 символов"),
    height: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    width: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    pocket_count: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    })
});

export type FormValuesStands = z.infer<typeof formSchemaStands>;
