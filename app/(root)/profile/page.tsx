import { PageTitle } from "@/components/page-title";
import { Profile, ProfileFormData } from "@/components/auth/profile";
import { prisma } from "@/prisma/prisma-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    const findUser = await prisma.user.findFirst({
        where: {
            id: session?.user?.id
        },
        include: {
            orders: true
        }
    });

    const onSubmit = async (data: ProfileFormData) => {
        "use server";

        if (data.phone != findUser?.phone) {
            await prisma.user.update({
                where: {
                    phone: findUser?.phone
                },
                data: {
                    verified: null
                }
            });
        }

        //TODO: Добавить аватарку
        await prisma.user.update({
            where: {
                id: session?.user?.id
            },
            data: {
                fullName: data.name,
                phone: data.phone,
                email: data.email
            }
        });
    };

    return (
        <>
            <PageTitle>Профиль клиента</PageTitle>
            <Profile
                userPassword={findUser?.password}
                onSubmitAction={onSubmit}
                orders={
                    findUser?.orders.map(order => {
                        return {
                            id: order.id,
                            payment_status: order.payment_status,
                            createdAt: order.createdAt.toLocaleDateString(),
                            totalAmount: order.totalAmount,
                            status: order.status
                        };
                    }) || []
                }
                verified={findUser?.verified ? true : false}
            />
        </>
    );
}
