import { prisma } from "@/prisma/prisma-client";
import { AddressPlaque } from "@prisma/client";

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
