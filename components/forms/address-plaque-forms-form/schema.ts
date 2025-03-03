import { z } from "zod";

export const formSchemaAddressPlaqueForms = z.object({
    name: z.string().min(2, "Название должно быть больше 2 символов"),
    price: z.number().min(1, "Цена должна быть больше 0"),
    height: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    width: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    })
});

export type FormValuesAddressPlaqueForms = z.infer<typeof formSchemaAddressPlaqueForms>;
