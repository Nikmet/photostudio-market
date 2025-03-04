import { PricesFormValues } from "@/components/prices-forms/prices-schema";
import { prisma } from "@/prisma/prisma-client";

export const updatePrices = async (data: PricesFormValues) => {
    Object.entries(data).forEach(async ([, value], i) => {
        await prisma.prices.update({
            where: {
                id: i + 1
            },
            data: {
                value: value
            }
        });
    });
};

export const getDefaultPrices = async () => {
    const prices = await prisma.prices.findMany({
        orderBy: {
            id: "asc"
        }
    });

    console.log(prices);

    const defaultValues: PricesFormValues = {
        cupPrice: prices[0].value,
        tShirtOneSidePrice: prices[1].value,
        tShirtTwoSidesPrice: prices[2].value,
        lecPrice: prices[3].value,
        badgePrice: prices[4].value,
        substrateMagnet: prices[5].value,
        acrylicMagnet: prices[6].value,
        printingWithTooling: prices[7].value,
        printingWithoutTooling: prices[8].value,
        bannerThreeHundred: prices[9].value,
        bannerFourHundred: prices[10].value,
        luvers: prices[11].value,
        stand: prices[12].value,
        pocket: prices[13].value,
        oneSideBusinessCard: prices[14].value,
        twoSidesBusinessCard: prices[15].value,
        backdrop: prices[16].value,
        suspension: prices[17].value,
        glass: prices[18].value
    };

    return defaultValues;
};
