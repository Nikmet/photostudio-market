import { prisma } from "@/prisma/prisma-client";
import { AddressPlaque, Difficile, LEC } from "@prisma/client";

const difficileMultiplier: Record<Difficile, number> = {
    [Difficile.EASY]: 1,
    [Difficile.MEDIUM]: 3,
    [Difficile.HARD]: 5
};

export const calcAddressPlaquePrice = async (data: AddressPlaque) => {
    const findColor = await prisma.color.findFirst({
        where: {
            id: data.colorId
        }
    });

    if (!findColor) {
        throw new Error("Цвет не найден");
    }

    const findForm = await prisma.addressPlaqueForm.findFirst({
        where: {
            id: data.formId
        }
    });

    if (!findForm) {
        throw new Error("Форма не найдена");
    }

    const formSquare = (findForm.width * findForm.height) / 1000000;

    return findColor.price * formSquare + findForm.price;
};

export const calcLECPrice = (data: LEC) => {
    const square = (data.width * data.height) / 1000000;
    //!Установить цену
    const findPrice = 1000;

    return square * findPrice * difficileMultiplier[data.difficile];
};
