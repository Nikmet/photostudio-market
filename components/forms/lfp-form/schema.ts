import { z } from "zod";

export const formSchemaLFP = z.object({
    name: z.string().min(2, "Название должно быть больше 2 символов"),
    paper_type_id: z.string().min(1, "Поле обязательно"),
    height: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    width: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    })
});

export type FormValuesLFP = z.infer<typeof formSchemaLFP>;
