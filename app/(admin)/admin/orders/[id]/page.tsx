import { IColumnsProps } from "@/@types/column-props";
import { AdminTable } from "@/components/admin-table";
import { OrderForm } from "@/components/forms/orders-form/orders-form";
import { FormValuesOrders } from "@/components/forms/orders-form/schema";
import { PageTitle } from "@/components/page-title";
import { prisma } from "@/prisma/prisma-client";

interface Props {
    params: Promise<{
        id: string;
    }>;
}
export default async function ProductPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findOrder = await prisma.order.findFirst({
        where: {
            id: id
        },
        include: {
            products: true,
            user: true
        }
    });

    const flattenedProduct = findOrder?.products.map(product => ({
        id: product.id,
        itemId: product.itemId,
        itemName: product.itemName,
        price: product.price
    }));

    if (!flattenedProduct) {
        return (
            <div>
                <PageTitle>{findOrder?.id ? `Заказ | ${findOrder.id}` : `Новый заказ | ${id}`}</PageTitle>
            </div>
        );
    }

    const columns: IColumnsProps<(typeof flattenedProduct)[0]>[] = [
        { title: "Номер", key: "id" },
        { title: "Номер продукта", key: "itemId" },
        { title: "Название продукта", key: "itemName" },
        { title: "Цена", key: "price" }
    ];

    const handleSubmit = async (data: FormValuesOrders) => {
        "use server";

        console.log(data);
    };

    // const handleSubmit = async (data: FormValuesProducts) => {
    //     "use server";

    //     if (!findOrder) {
    //         throw new Error("Product not found");
    //     }

    //     await prisma.product.update({
    //         where: {
    //             id: id
    //         },
    //         data: {
    //             design: data.design,
    //             design_difficulty: data.design_difficulty as Difficile,
    //             comments: data.comment
    //         }
    //     });
    //     redirect("/admin/products");
    // };

    return (
        <div className="h-[77vh] overflow-auto scrollbar">
            <PageTitle>{findOrder?.id ? `Заказ | ${findOrder.id}` : `Новый заказ | ${id}`}</PageTitle>
            {findOrder ? (
                <OrderForm
                    defaultValues={{
                        userName: findOrder.user.fullName,
                        userEmail: findOrder.user.email,
                        userPhone: findOrder.user.phone,
                        order_status: findOrder.status,
                        order_payment_status: findOrder.payment_status,
                        comment: findOrder.comment || undefined
                    }}
                    onSubmit={handleSubmit}
                />
            ) : (
                <OrderForm onSubmit={handleSubmit} />
            )}
            <p className="text-2xl mb-2 mt-2">Таблица товаров</p>

            <AdminTable<(typeof flattenedProduct)[0]>
                data={flattenedProduct}
                route="products"
                columns={columns}
                total={findOrder?.totalAmount.toString()}
                rows_count={5}
                margin={200}
            />
        </div>
    );
}
