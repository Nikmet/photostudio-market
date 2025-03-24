import { z } from "zod";

export const formSchemaClients = z.object({
    fullName: z.string().min(1, "Поле обязательно"),
    phone: z.string().min(1, "Поле обязательно"),
    email: z.string().email("Неверный формат почты"),
});

export type FormValuesClients = z.infer<typeof formSchemaClients>;
