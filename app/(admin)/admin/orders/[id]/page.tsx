import { OrderForm } from "@/components/forms/orders-form/orders-form";
import { FormValuesOrders } from "@/components/forms/orders-form/schema";
import { OrdersTable, ProductItemWithProduct } from "@/components/orders-table";
import { PageTitle } from "@/components/page-title";
import { prisma } from "@/prisma/prisma-client";
import { OrderPaymentStatus, OrderStatus } from "@prisma/client";

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
            products: {
                include: {
                    product: true
                }
            },
            user: true
        }
    });

    const orderProducts: ProductItemWithProduct[] =
        findOrder?.products?.map(product => ({
            id: Number(product.id),
            productId: product.productId,
            count: product.count,
            total: product.total,
            categoryId: product.product.categoryId,
            createdAt: product.product.createdAt,
            updatedAt: product.product.updatedAt,
            price: product.product.price,
            design: product.product.design,
            design_difficulty: product.product.design_difficulty,
            itemId: product.product.itemId,
            itemName: product.product.itemName,
            comments: product.product.comments,
            route: product.product.route
        })) || [];

    const handleSubmit = async (data: FormValuesOrders) => {
        "use server";

        console.log(data);
    };

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
                >
                    <p className="text-2xl mb-2 mt-2">Таблица товаров</p>
                    <OrdersTable data={orderProducts} rows_count={5} totalProp={findOrder.totalAmount} />
                </OrderForm>
            ) : (
                <OrderForm
                    onSubmit={handleSubmit}
                    defaultValues={{
                        order_payment_status: OrderPaymentStatus.PENDING,
                        order_status: OrderStatus.ACCEPTED,
                        userName: "",
                        userEmail: "",
                        userPhone: "",
                        comment: ""
                    }}
                >
                    <p className="text-2xl mb-2 mt-2">Таблица товаров</p>
                    <OrdersTable rows_count={5} totalProp={0} />
                </OrderForm>
            )}
        </div>
    );
}
