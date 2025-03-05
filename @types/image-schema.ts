import { z } from "zod";

// Кастомная валидация для файла
const fileSchema = z.custom<File>(val => {
    return val instanceof File; // Проверяем, что объект является экземпляром File
}, "Invalid file");

// Расширим схему для проверки типа файла (например, только изображения)
export const imageSchema = fileSchema.refine(file => file.type.startsWith("image/"), "File must be an image");
