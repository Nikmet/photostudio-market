import { z } from "zod";

export const formSchemaFrames = z.object({
    name: z.string().min(2, "Название должно быть больше 2 символов"),
    baguetteId: z.string().min(1, "Поле обязательно"),
    height: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    width: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    has_glass: z.boolean(),
    has_backdrop: z.boolean(),
    has_suspension: z.boolean()
});

export type FormValuesFrames = z.infer<typeof formSchemaFrames>;
