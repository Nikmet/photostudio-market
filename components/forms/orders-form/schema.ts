import { orderPaymentStatus, orderStatus } from "@/@types/enums";
import { z } from "zod";

export const formSchemaOrders = z.object({
    userName: z.string().min(2, "Имя пользователя должно быть больше 2 символов"),
    userPhone: z.string().min(2, "Телефон должен быть больше 2 символов"),
    userEmail: z.string().min(2, "Электронная почта должна быть больше 2 символов"),
    order_status: z.enum(Object.keys(orderStatus) as [string, ...string[]], {
        required_error: "Поле обязательно"
    }),
    order_payment_status: z.enum(Object.keys(orderPaymentStatus) as [string, ...string[]], {
        required_error: "Поле обязательно"
    }),
    comment: z.string().optional()
});

export type FormValuesOrders = z.infer<typeof formSchemaOrders>;
