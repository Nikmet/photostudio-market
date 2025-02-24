export function formatTableCell<T>(value: T[keyof T]): string {
    if (!value) {
        return "Отсутствует";
    }

    if (typeof value === "boolean") {
        return "Есть";
    }
    return value as string;
}
