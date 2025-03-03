import { z } from "zod";

export const formSchemaAddressPlaqueForms = z.object({
    name: z.string().min(2, "Название должно быть больше 2 символов")
});

export type FormValuesAddressPlaqueForms = z.infer<typeof formSchemaAddressPlaqueForms>;
