import { z } from "zod";

export const formSchemaPromo = z.object({
    title: z.string().min(2, "Название должно быть больше 2 символов"),
    content: z.string(),
    route: z.string().min(2, "Путь должен быть больше 2 символов"),
    alt: z.string().min(2, "Название должно быть больше 2 символов"),
    image: z
        .instanceof(File)
        .refine(file => file.type.startsWith("image/"), {
            message: "Неверный формат изображения"
        })
        .refine(file => file.size < 4000000, {
            message: "Размер изображения не должен превышать 4MB"
        })
        .refine(
            async file => {
                if (!file.type.startsWith("image/")) {
                    return Promise.resolve(false);
                }

                return new Promise<boolean>(resolve => {
                    const img = new Image();
                    img.onload = () => {
                        const isValid = img.naturalHeight >= 250;
                        URL.revokeObjectURL(img.src); // Освобождаем память
                        resolve(isValid);
                    };
                    img.onerror = () => {
                        URL.revokeObjectURL(img.src); // Освобождаем память
                        resolve(false);
                    };
                    img.src = URL.createObjectURL(file);
                });
            },
            {
                message: "Высота изображения должна быть не менее 250px"
            }
        )
});

export type FormValuesPromo = z.infer<typeof formSchemaPromo>;
