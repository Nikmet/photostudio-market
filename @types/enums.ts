import {
    BannerDensity,
    Difficile,
    MagnetType,
    OrderPaymentStatus,
    OrderStatus,
    PrintingSide,
    PrintingType,
    Size
} from "@prisma/client";

export const printingTypes: Record<PrintingType, string> = {
    [PrintingType.WITH_TOOLING]: "С оснасткой",
    [PrintingType.WITHOUT_TOOLING]: "Без оснастки"
};

export const printingSides: Record<PrintingSide, string> = {
    [PrintingSide.ONE_SIDE]: "Односторонняя",
    [PrintingSide.TWO_SIDES]: "Двусторонняя"
};

export const sizes: Record<Size, string> = {
    [Size.XS]: "XS",
    [Size.S]: "S",
    [Size.M]: "M",
    [Size.L]: "L",
    [Size.XL]: "XL",
    [Size.TWO_XL]: "2XL",
    [Size.THREE_XL]: "3XL"
};

export const magnetTypes: Record<MagnetType, string> = {
    [MagnetType.ACRYLIC]: "Акрил",
    [MagnetType.SUBSTRATE]: "Подложка"
};

export const difficile: Record<Difficile, string> = {
    [Difficile.EASY]: "Легкая",
    [Difficile.MEDIUM]: "Средняя",
    [Difficile.HARD]: "Сложная"
};

export const density: Record<BannerDensity, string> = {
    [BannerDensity.FOUR_HUNDRED]: "400 г/м²",
    [BannerDensity.THREE_HUNDRED]: "300 г/м²"
};

export const orderStatus: Record<OrderStatus, string> = {
    [OrderStatus.ACCEPTED]: "Принят",
    [OrderStatus.IN_WORK]: "В работе",
    [OrderStatus.COMPLETED]: "Готов"
};

export const orderPaymentStatus: Record<OrderPaymentStatus, string> = {
    [OrderPaymentStatus.PENDING]: "В ожидании оплаты",
    [OrderPaymentStatus.CANCELED]: "Отменен",
    [OrderPaymentStatus.SUCCEEDED]: "Оплачен"
};

