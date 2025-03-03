import { z } from "zod";

export const formSchemaAddressPlaques = z.object({
    name: z.string().min(2, "Название должно быть больше 2 символов"),
    address: z.string().min(2, "Адрес должен быть больше 2 символов"),
    colorId: z.string().min(1, "Выберите цвет"),
    formId: z.string().min(1, "Выберите форму")
});

export type FormValuesAddressPlaques = z.infer<typeof formSchemaAddressPlaques>;
