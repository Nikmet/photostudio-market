import { ProductForm } from "@/components/forms/product-form/product-form";
import { FormValuesProducts } from "@/components/forms/product-form/schema";
import { PageTitle } from "@/components/page-title";
import { prisma } from "@/prisma/prisma-client";
import { Difficile } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}
export default async function ProductPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findProduct = await prisma.product.findFirst({
        where: {
            id: id
        },
        include: {
            category: true
        }
    });

    const handleSubmit = async (data: FormValuesProducts) => {
        "use server";

        if (!findProduct) {
            throw new Error("Product not found");
        }

        await prisma.product.update({
            where: {
                id: id
            },
            data: {
                design: data.design,
                design_difficulty: data.design_difficulty as Difficile,
                comments: data.comment,
                price: Number(data.price)
            }
        });
        redirect("/admin/products");
    };

    return (
        <div>
            <PageTitle>{findProduct?.id ? `Продукт | ${findProduct.id}` : `Новый продукт | ${id}`}</PageTitle>
            {findProduct ? (
                <ProductForm
                    defaultValues={{
                        design: findProduct.design,
                        design_difficulty: findProduct.design_difficulty,
                        comment: findProduct.comments || undefined,
                        price: findProduct.price.toFixed(2)
                    }}
                    onSubmit={handleSubmit}
                    category={findProduct.category.name}
                    itemId={findProduct.itemId}
                    itemName={findProduct.itemName}
                    route={findProduct.route}
                />
            ) : (
                <ProductForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
