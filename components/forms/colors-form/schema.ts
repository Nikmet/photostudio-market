import { z } from "zod";

export const formSchemaColors = z.object({
    name: z.string().min(1, "Поле обязательно"),
    rgb: z.string().min(1, "Поле обязательно")
});

export type FormValuesColors = z.infer<typeof formSchemaColors>;
