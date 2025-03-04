import { prisma } from "@/prisma/prisma-client";
import {
    AddressPlaque,
    Banner,
    BannerDensity,
    BusinessCard,
    Difficile,
    Frame,
    LEC,
    LFP,
    Magnet,
    MagnetType,
    PriceType,
    Printing,
    PrintingSide,
    PrintingType,
    Stand,
    Table,
    TShirt
} from "@prisma/client";

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

export const calcLECPrice = async (data: LEC) => {
    const square = (data.width * data.height) / 1000000;
    const findPrice = await prisma.prices.findFirst({
        where: {
            priceType: PriceType.LEC
        }
    });

    const price = findPrice?.value || 0;

    return square * price * difficileMultiplier[data.difficile];
};

export const calcCupPrice = async () => {
    const price = await prisma.prices.findFirst({
        where: {
            priceType: PriceType.CUP
        }
    });

    return price?.value || 0;
};

export const calcTShirtPrice = async (data: TShirt) => {
    let price;

    if (data.printingSide === PrintingSide.ONE_SIDE) {
        price = await prisma.prices.findFirst({
            where: {
                priceType: PriceType.ONE_SIDE_T_SHIRT
            }
        });
    } else {
        price = await prisma.prices.findFirst({
            where: {
                priceType: PriceType.TWO_SIDES_T_SHIRT
            }
        });
    }

    return price?.value || 0;
};

export const calcBadgePrice = async () => {
    const price = await prisma.prices.findFirst({
        where: {
            priceType: PriceType.BADGE
        }
    });

    return price?.value || 0;
};

export const calcMagnetPrice = async (data: Magnet) => {
    let findPrice;

    if (data.magnet_type === MagnetType.SUBSTRATE) {
        findPrice = await prisma.prices.findFirst({
            where: {
                priceType: PriceType.SUBSTRATE_MAGNET
            }
        });
    } else {
        findPrice = await prisma.prices.findFirst({
            where: {
                priceType: PriceType.ACRYLIC_MAGNET
            }
        });
    }

    const square = (data.height * data.width) / 1000000;
    const price = findPrice?.value || 0;

    return price * square;
};

export const calcPrintingPrice = async (data: Printing) => {
    let findPrice;

    if (data.printing_type === PrintingType.WITH_TOOLING) {
        findPrice = await prisma.prices.findFirst({
            where: {
                priceType: PriceType.PRINTING_WITH_TOOLING
            }
        });
    } else {
        findPrice = await prisma.prices.findFirst({
            where: {
                priceType: PriceType.PRINTING_WITHOUT_TOOLING
            }
        });
    }

    const price = findPrice?.value ?? 0;

    return price;
};

export const calcBannerPrice = async (data: Banner) => {
    let findPrice;

    if (data.density === BannerDensity.THREE_HUNDRED) {
        findPrice = await prisma.prices.findFirst({
            where: {
                priceType: PriceType.BANNER_THREE_HUNDRED
            }
        });
    } else {
        findPrice = await prisma.prices.findFirst({
            where: {
                priceType: PriceType.BANNER_FOUR_HUNDRED
            }
        });
    }

    const findLuversPrice = await prisma.prices.findFirst({
        where: {
            priceType: PriceType.LUVERS
        }
    });

    const price = findPrice?.value || 0;
    const square = (data.height * data.width) / 1000000;
    const luversPrice = findLuversPrice?.value || 0;

    return price * square + luversPrice * data.luvers_count;
};

export const calcStandPrice = async (data: Stand) => {
    const findPrice = await prisma.prices.findFirst({
        where: {
            priceType: PriceType.STAND
        }
    });

    const findPocketPrice = await prisma.prices.findFirst({
        where: {
            priceType: PriceType.POCKET
        }
    });

    const price = findPrice?.value ?? 0;
    const pocketPrice = findPocketPrice?.value ?? 0;
    const square = (data.height * data.width) / 1000000;

    return price * square + pocketPrice * data.pocket_count;
};

export const calcTablePrice = async (data: Table) => {
    const findColor = await prisma.color.findFirst({
        where: {
            id: data.colorId
        }
    });

    if (!findColor) {
        throw new Error("Цвет не найден");
    }

    const square = (data.width * data.height) / 1000000;
    const colorPrice = findColor.price ?? 0;

    return colorPrice * square;
};

export const calcNewsletterPrice = async (data: Table) => {
    const findColor = await prisma.color.findFirst({
        where: {
            id: data.colorId
        }
    });

    if (!findColor) {
        throw new Error("Цвет не найден");
    }

    const square = (data.width * data.height) / 1000000;
    const colorPrice = findColor?.price || 0;

    return colorPrice * square;
};

export const calcLFPPrice = async (data: LFP) => {
    const findPaperType = await prisma.paperType.findFirst({
        where: {
            id: data.paper_type_id
        }
    });

    const paperPrice = findPaperType?.price ?? 0;
    const square = (data.width * data.height) / 1000000;

    return paperPrice * square;
};

export const calcBusinessCardPrice = async (data: BusinessCard) => {
    let price;

    if (data.printing_side === PrintingSide.ONE_SIDE) {
        price = await prisma.prices.findFirst({
            where: {
                priceType: PriceType.ONE_SIDE_BUSINESS_CARD
            }
        });
    } else {
        price = await prisma.prices.findFirst({
            where: {
                priceType: PriceType.TWO_SIDES_BUSINESS_CARD
            }
        });
    }

    return price?.value ?? 0;
};

export const calcFramePrice = async (data: Frame) => {
    const findBaguette = await prisma.baguette.findFirst({
        where: {
            id: data.baguetteId
        }
    });

    if (!findBaguette) {
        throw new Error("Багет не найден");
    }

    const baguettePrice = findBaguette.price ?? 0;
    const square = (data.width * data.height) / 1000000;
    const perimeter = (data.width + data.height) * 2 / 1000;

    let startPrice = baguettePrice * perimeter;

    if (data.has_backdrop) {
        const findBackdropPrice = await prisma.prices.findFirst({
            where: {
                priceType: PriceType.BACKDROP
            }
        });
        const backdropPrice = findBackdropPrice?.value ?? 0;
        startPrice += backdropPrice * square;
    }

    if (data.has_glass) {
        const findGlassPrice = await prisma.prices.findFirst({
            where: {
                priceType: PriceType.GLASS
            }
        });
        const glassPrice = findGlassPrice?.value ?? 0;
        startPrice += glassPrice * square;
    }

    if (data.has_suspension) {
        const findSuspensionPrice = await prisma.prices.findFirst({
            where: {
                priceType: PriceType.SUSPENSION
            }
        });
        const suspensionPrice = findSuspensionPrice?.value ?? 0;
        startPrice += suspensionPrice;
    }

    return startPrice;
};
