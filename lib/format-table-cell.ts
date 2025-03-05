import { BannerDensity, Difficile, MagnetType, PrintingSide, PrintingType, Size } from "@prisma/client";

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
        { key: BannerDensity.THREE_HUNDRED, title: "300 г/м²" }
    ];

    const findEnum = enumsValues.find(item => item.key === value);
    return findEnum?.title ?? value;
};

export function formatTableCell<T>(value: T[keyof T]): string {
    if (!value) {
        return "Отсутствует";
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
