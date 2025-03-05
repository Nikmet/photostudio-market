import { Image } from "@prisma/client";

export const uploadImage = async (file: File | null): Promise<Image | undefined> => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/upload`, {
        method: "POST",
        body: formData
    });

    if (response.ok) {
        const result: Image = await response.json();
        return result;
    }
};
