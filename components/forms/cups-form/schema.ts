import { z } from "zod";

export const formSchemaCups = z.object({
    name: z.string().min(2, "Название должно быть больше 2 символов")
});

export type FormValuesCups = z.infer<typeof formSchemaCups>;
