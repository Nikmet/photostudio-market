import { OrderForm } from "@/components/forms/orders-form/orders-form";
import { FormValuesOrders } from "@/components/forms/orders-form/schema";
import { ProductItemWithProduct } from "@/components/orders-table";
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
            route: product.product.route,
            orderId: product.orderId,
            cartId: product.cartId
        })) || [];

    const handleSubmit = async (data: FormValuesOrders, products: ProductItemWithProduct[]) => {
        "use server";

        const total = products.reduce((acc, product) => acc + product.total, 0);

        try {
            const findOrder = await prisma.order.findFirst({
                where: {
                    id: id
                }
            });

            const findUser = await prisma.user.findFirst({
                where: {
                    fullName: data.userName,
                    phone: data.userPhone
                }
            });

            if (findOrder) {
                console.log(data);

                await prisma.order.update({
                    where: {
                        id: id
                    },
                    data: {
                        user: {
                            connect: {
                                id: findUser?.id
                            }
                        },
                        status: data.order_status as OrderStatus,
                        payment_status: data.order_payment_status as OrderPaymentStatus,
                        totalAmount: total,
                        comment: data.comment
                    }
                });

                await prisma.productItem.deleteMany({
                    where: {
                        orderId: id
                    }
                });
            } else {
                await prisma.order.create({
                    data: {
                        id: id,
                        user: {
                            connect: {
                                id: findUser?.id
                            }
                        },
                        status: data.order_status as OrderStatus,
                        payment_status: data.order_payment_status as OrderPaymentStatus,
                        totalAmount: total,
                        comment: data.comment
                    }
                });
            }
        } catch (e) {
            console.log(e);
        }

        products.forEach(async product => {
            try {
                await prisma.productItem.create({
                    data: {
                        product: {
                            connect: {
                                id: product.productId
                            }
                        },
                        count: product.count,
                        total: product.total,
                        Order: {
                            connect: {
                                id: id
                            }
                        }
                    }
                });
            } catch (e) {
                console.log(e);
            }
        });
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
                    productsProp={orderProducts}
                    orderTotal={findOrder.totalAmount}
                />
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
                    productsProp={[]}
                    orderTotal={0}
                />
            )}
        </div>
    );
}
