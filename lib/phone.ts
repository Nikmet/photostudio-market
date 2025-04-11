export const formatPhoneNumber = (value: string): string => {
    if (!value.startsWith("+7 ")) {
        value = "+7 " + value.replace(/\D/g, "");
    }

    const cleaned = value.replace(/\D/g, "").slice(1);
    let formattedValue = "+7 ";

    if (cleaned.length > 0) {
        if (cleaned.length > 0) {
            formattedValue += "(" + cleaned.slice(0, 3);
        }

        if (cleaned.length > 3) {
            formattedValue += ") " + cleaned.slice(3, 6);
        }

        if (cleaned.length > 6) {
            formattedValue += "-" + cleaned.slice(6, 8);
        }

        if (cleaned.length > 8) {
            formattedValue += "-" + cleaned.slice(8, 10);
        }
    }

    return formattedValue;
};

export const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const input = e.target.value;

    // Если пытаются удалить +7, игнорируем
    if (input.length < 3) {
        onChange("+7 ");
        return;
    }

    // Если +7 был изменен, восстанавливаем
    if (!input.startsWith("+7 ")) {
        const digits = input.replace(/\D/g, "").slice(0, 10);
        onChange(formatPhoneNumber("+7 " + digits));
        return;
    }

    const formatted = formatPhoneNumber(input);
    onChange(formatted);
};

export const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Запрещаем удаление +7 с помощью Backspace или Delete
    const target = e.target as HTMLInputElement;
    if ((e.key === "Backspace" || e.key === "Delete") && target.selectionStart && target.selectionStart <= 3) {
        e.preventDefault();
    }
};
