import { Image } from "@prisma/client";

export const imageToFile = (image: Image | null): File | undefined => {
    if (!image) return undefined;

    const arrayBuffer = image.data.buffer.slice(image.data.byteOffset, image.data.byteOffset + image.data.byteLength);

    // Преобразуем ArrayBuffer в Uint8Array
    const uint8Array = new Uint8Array(arrayBuffer);

    // Создаем File из Uint8Array
    return new File([uint8Array], image.fileName, { type: image.mimeType });
};
