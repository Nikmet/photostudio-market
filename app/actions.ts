import { prisma } from "@/prisma/prisma-client";

export const createProduct = async (itemId: string, itemName: string, categoryName: string, price: number) => {
    try {
        const category = await prisma.category.findFirst({
            where: {
                name: categoryName
            }
        });

        if (!category) {
            throw new Error("Категория не найдена");
        }
        await prisma.product.create({
            data: {
                itemId,
                itemName,
                categoryId: category.id,
                price
            }
        });
    } catch (e) {
        console.log("[CREATE_PRODUCT_ACTION]", e);
    }
};
