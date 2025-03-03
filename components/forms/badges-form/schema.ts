import { z } from "zod";

export const formSchemaBadges = z.object({
    name: z.string().min(2, "Название должно быть больше 2 символов")
});

export type FormValuesBadges = z.infer<typeof formSchemaBadges>;
