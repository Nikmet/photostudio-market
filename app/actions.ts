import { createUid, getId } from "@/lib/uid";
import { prisma } from "@/prisma/prisma-client";
import { Difficile } from "@prisma/client";

export const createProduct = async (
    itemId: string,
    itemName: string,
    categoryName: string,
    price: number,
    route: string
) => {
    try {
        const category = await prisma.category.findFirst({
            where: {
                name: categoryName
            }
        });

        if (!category) {
            throw new Error("Категория не найдена");
        }

        const lastProduct = await prisma.product.findFirst({
            orderBy: {
                id: "desc"
            }
        });

        let id;

        if (!lastProduct) {
            id = createUid("ПР", "1");
        } else {
            id = createUid("ПР", (Number(getId(lastProduct.id)) + 1).toString());
        }

        console.log({
            id: createUid("ПР", getId(id)),
            itemId,
            itemName,
            categoryId: category.id,
            price,
            route
        });

        await prisma.product.create({
            data: {
                id: createUid("ПР", getId(id)),
                itemId,
                itemName,
                categoryId: category.id,
                price,
                route
            }
        });

        console.log("Product created");
    } catch (e) {
        console.error("[CREATE_PRODUCT_ACTION]", e);
    }
};

export const updateProduct = async (itemId: string, itemName: string, price: number) => {
    try {
        const findProduct = await prisma.product.findFirst({
            where: {
                itemId
            }
        });

        console.log(findProduct);

        if (!findProduct) {
            throw new Error("Продукт не найден");
        }

        await prisma.product.update({
            where: {
                id: findProduct.id
            },
            data: {
                itemName,
                price,
                design: false,
                design_difficulty: Difficile.EASY
            }
        });
    } catch (e) {
        console.log(e);
    }
};

export const deleteProducts = async (ids: string[]) => {
    try {
        await prisma.product.deleteMany({
            where: {
                itemId: {
                    in: ids
                }
            }
        });
    } catch (e) {
        console.error("[DELETE_PRODUCTS_ACTION]", e);
    }
};
