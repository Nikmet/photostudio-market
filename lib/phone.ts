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
