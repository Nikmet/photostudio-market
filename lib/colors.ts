export const hexToRgb = (hex: string): string => {
    hex = hex.replace(/^#/, "");

    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `${r}, ${g}, ${b}`;
};

export const rgbStringToHex = (rgbString: string): string => {
    console.log(rgbString);

    // 1. Разделяем строку на компоненты
    const [r, g, b] = rgbString.split(",").map(component => {
        // Убираем пробелы и преобразуем в число
        return parseInt(component.trim(), 10);
    });

    // 2. Проверяем, что все компоненты валидны
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
        throw new Error("Некорректный формат RGB-строки");
    }

    // 3. Преобразуем каждое число в HEX и добавляем ведущий ноль, если необходимо
    const toHex = (value: number): string => {
        const hex = value.toString(16); // Преобразуем в HEX
        return hex.length === 1 ? `0${hex}` : hex; // Добавляем ведущий ноль, если нужно
    };

    // 4. Объединяем компоненты в HEX-цвет
    const hexColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

    return hexColor;
};
