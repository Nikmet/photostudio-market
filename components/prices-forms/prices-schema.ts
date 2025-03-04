import { z } from "zod";

export const pricesFormSchema = z.object({
    cupPrice: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    tShirtOneSidePrice: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    tShirtTwoSidesPrice: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    lecPrice: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    badgePrice: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    substrateMagnet: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    acrylicMagnet: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    printingWithTooling: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    printingWithoutTooling: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    bannerThreeHundred: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    bannerFourHundred: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    luvers: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    stand: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    pocket: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    oneSideBusinessCard: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    twoSidesBusinessCard: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    backdrop: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    suspension: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    }),
    glass: z.number({
        required_error: "Поле обязательно",
        invalid_type_error: "Значение должно быть числом"
    })
});

export type PricesFormValues = z.infer<typeof pricesFormSchema>;