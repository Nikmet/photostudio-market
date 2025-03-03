import { z } from "zod";

export const formSchemaFrames = z.object({
    name: z.string().min(2, "Название должно быть больше 2 символов"),
    
});

export type FormValuesFrames = z.infer<typeof formSchemaFrames>;
