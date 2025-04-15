import { createUid, getId } from "@/lib/uid";
import { prisma } from "@/prisma/prisma-client";
import { Difficile } from "@prisma/client";
import { writeFile } from "fs";

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

        const product = await prisma.product.create({
            data: {
                id: createUid("ПР", getId(id)),
                itemId,
                itemName,
                categoryId: category.id,
                price,
                route
            }
        });

        return product;
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
        console.error(e);
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

export const uploadImage = async (file: File | undefined) => {
    if (!file) {
        return "";
    }

    const buffer = await file.arrayBuffer();
    const fileName = file.name.replaceAll(" ", "_");

    await writeFile(`./public/images/${fileName}`, Buffer.from(buffer), err => {
        if (err) {
            console.error(err);
        }
    });

    return `/images/${fileName}`;
};
