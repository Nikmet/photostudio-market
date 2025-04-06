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

const changeEnum = (value: string) => {
    const enumsValues = [
        { key: PrintingType.WITH_TOOLING, title: "С оснасткой" },
        { key: PrintingType.WITHOUT_TOOLING, title: "Без оснастки" },
        { key: PrintingSide.ONE_SIDE, title: "Односторонняя" },
        { key: PrintingSide.TWO_SIDES, title: "Двусторонняя" },
        { key: Size.TWO_XL, title: "2XL" },
        { key: Size.THREE_XL, title: "3XL" },
        { key: Difficile.EASY, title: "Легкий" },
        { key: Difficile.MEDIUM, title: "Средний" },
        { key: Difficile.HARD, title: "Сложный" },
        { key: MagnetType.ACRYLIC, title: "Акрил" },
        { key: MagnetType.SUBSTRATE, title: "Подложка" },
        { key: BannerDensity.FOUR_HUNDRED, title: "400 г/м²" },
        { key: BannerDensity.THREE_HUNDRED, title: "300 г/м²" },
        { key: OrderStatus.ACCEPTED, title: "Принят" },
        { key: OrderStatus.COMPLETED, title: "Готов" },
        { key: OrderStatus.IN_WORK, title: "В работе" },
        { key: OrderPaymentStatus.CANCELED, title: "Отменен" },
        { key: OrderPaymentStatus.SUCCEEDED, title: "Оплачен" },
        { key: OrderPaymentStatus.PENDING, title: "В ожидании оплаты" }
    ];

    const findEnum = enumsValues.find(item => item.key === value);
    return findEnum?.title ?? value;
};

export function formatTableCell<T>(value: T[keyof T]): string {
    if (!value) {
        return "Отсутствует";
    }

    if (Array.isArray(value)) {
        return value.join(", ");
    }

    if (typeof value === "string") {
        if (value.includes("/images/")) {
            return "Есть";
        }

        return value;
    }

    if (typeof value === "object") {
        return "Есть";
    }

    if (typeof value === "boolean") {
        return "Есть";
    }

    if (typeof value === "number") {
        return value.toFixed(2);
    }

    return changeEnum(value as string);
}
