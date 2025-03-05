import { Image } from "@prisma/client";

export const imageToFile = (image: Image | null): File | undefined => {
    if (!image) return undefined;

    const arrayBuffer = image.data.buffer.slice(image.data.byteOffset, image.data.byteOffset + image.data.byteLength);

    // Преобразуем ArrayBuffer в Uint8Array
    const uint8Array = new Uint8Array(arrayBuffer);

    // Создаем Blob из Uint8Array
    const blob = new Blob([uint8Array], { type: image.mimeType });

    // Создаем File из Blob, если нужно указать имя файла
    return new File([blob], image.fileName, { type: image.mimeType });
};
