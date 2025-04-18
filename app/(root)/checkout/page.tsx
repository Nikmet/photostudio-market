import { OrderClientForm, OrderClientFormValues } from "@/components/client-forms/order-client-form";
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

        // Получаем корзину с товарами
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

        // Если оплата онлайн - редирект на страницу оплаты
        if (data.paymentMethod === "online") {
            redirect("/payment");
        }

        // Создаем заказ
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

            // 2. Создаем новые ProductItem для заказа (вместо переноса)
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
        });

        // Редирект на страницу успешного оформления
        redirect("/checkout/success");
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <OrderClientForm onSubmit={handleSubmit} />
        </div>
    );
}
