import { difficile } from "@/@types/enums";
import { z } from "zod";

export const formSchemaProducts = z.object({
    design: z.boolean().default(false),
    design_difficulty: z.enum(Object.keys(difficile) as [string, ...string[]]).optional(),
    comment: z.string().optional()
});

export type FormValuesProducts = z.infer<typeof formSchemaProducts>;
