import { createUid, getId } from "@/lib/uid";
import { prisma } from "@/prisma/prisma-client";
import { Difficile, Product } from "@prisma/client";
import { writeFile } from "fs";

export const createProduct = async (
    itemId: string,
    itemName: string,
    categoryName: string,
    price: number,
    route: string,
    comments: string = ""
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
                route,
                comments,
            }
        });

        console.log(product);

        return product;
    } catch (e) {
        if (e instanceof Error) {
            console.error("[CREATE_PRODUCT_ACTION]", e.message);
        } else {
            console.error("[CREATE_PRODUCT_ACTION]", "An unknown error occurred");
        }
        return null;
    }
};

export const creteProductItem = async (product: Product, userId: string) => {
    try {
        const cart = await prisma.cart.findFirst({
            where: {
                userId
            }
        });

        if (!cart) {
            throw new Error("Корзина не найдена");
        }

        const productItem = await prisma.productItem.create({
            data: {
                cartId: cart.id,
                productId: product.id,
                count: 1,
                total: product.price
            }
        });

        const updatedCart = await prisma.cart.update({
            where: {
                id: cart.id
            },
            data: {
                totalAmount: {
                    increment: productItem.total
                }
            }
        });

        return updatedCart;
    } catch (e) {
        console.error(e);
        return null;
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
