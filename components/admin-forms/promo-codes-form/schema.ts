import { z } from "zod";

export const formSchemaPromoCode = z.object({
    code: z.string().min(5, "Код должен быть больше 5 символов"),
    discount: z.number().min(1, "Скидка должна быть больше 1%").max(100, "Скидка должна быть меньше 100%")
});

export type FormValuesPromoCode = z.infer<typeof formSchemaPromoCode>;
