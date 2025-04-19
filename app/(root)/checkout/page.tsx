import { OrderClientForm, OrderClientFormValues } from "@/components/client-forms/order-client-form";
import { createPayment } from "@/lib/create-paement";
import { createUid } from "@/lib/uid";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
    const handleSubmit = async (data: OrderClientFormValues, userId: string) => {
        "use server";

        let id;

        const lastId = (
            await prisma.order.findFirst({
                orderBy: {
                    id: "desc"
                }
            })
        )?.id;

        if (!lastId) {
            id = createUid("ЗАК", "1");
        } else {
            id = createUid("ЗАК", (Number(lastId.split("-")[1]) + 1).toString());
        }

        const cart = await prisma.cart.findFirst({
            where: {
                userId
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!cart) {
            throw new Error("Корзина не найдена");
        }

        let paymentUrl: string | undefined;

        await prisma.$transaction(async tx => {
            // 1. Создаем заказ
            const order = await tx.order.create({
                data: {
                    id,
                    userId,
                    totalAmount: cart.totalAmount || 0,
                    comment: data.comment
                }
            });

            // 2. Создаем новые ProductItem для заказа
            await Promise.all(
                cart.items.map(item =>
                    tx.productItem.create({
                        data: {
                            productId: item.productId,
                            count: item.count,
                            total: item.count * item.product.price,
                            orderId: order.id
                        }
                    })
                )
            );

            // 3. Удаляем товары из корзины
            await tx.productItem.deleteMany({
                where: {
                    cartId: cart.id
                }
            });

            // 4. Обновляем сумму корзины
            await tx.cart.update({
                where: {
                    id: cart.id
                },
                data: {
                    totalAmount: 0
                }
            });

            // Если оплата онлайн - создаем платеж
            if (data.paymentMethod === "online") {
                const paymentData = await createPayment({
                    amount: cart.totalAmount,
                    description: `Оплата заказа №${order.id}`,
                    orderId: order.id
                });

                if (!paymentData) {
                    throw new Error("Payment data not found");
                }

                // Используем tx (transaction) вместо prisma
                await tx.order.update({
                    where: {
                        id: order.id
                    },
                    data: {
                        paymentId: paymentData.id
                    }
                });

                paymentUrl = paymentData.confirmation.confirmation_url; // Сохраняем URL для редиректа
            }
        });

        // Редирект
        if (data.paymentMethod === "online" && paymentUrl) {
            redirect(paymentUrl);
        } else {
            redirect("/checkout/success");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <OrderClientForm onSubmit={handleSubmit} />
        </div>
    );
}
