import { ClientForm } from "@/components/forms/clients-form/client-form";
import { FormValuesClients } from "@/components/forms/clients-form/schema";
import { PageTitle } from "@/components/page-title";
import { prisma } from "@/prisma/prisma-client";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function CupsEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findClient = await prisma.user.findFirst({
        where: {
            id: id
        },
        include: {
            orders: true
        }
    });

    const handleSubmit = async (data: FormValuesClients) => {
        "use server";

        // let printing_image: Image | undefined;

        // // Загружаем изображение, если оно есть
        // if (data.printing_image) {
        //     printing_image = await uploadImage(data.printing_image);
        // }

        console.log(data);

        if (!findClient) {
            await prisma.user.create({
                data: {
                    id: id,
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    role: "USER" as UserRole,
                    password: ""
                }
            });
        } else {
            await prisma.user.update({
                where: {
                    id: id
                },
                data: {
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    role: "USER",
                    password: ""
                }
            });
        }

        redirect("/admin/clients");
    };

    return (
        <div>
            <PageTitle>{findClient?.fullName ? `${findClient.fullName}` : `Новый клиент`}</PageTitle>

            {findClient ? (
                <ClientForm
                    onSubmit={handleSubmit}
                    defaultValues={{
                        fullName: findClient.fullName,
                        phone: findClient.phone,
                        email: findClient.email
                    }}
                    orders={findClient.orders.map(order => ({
                        id: order.id,
                        payment_status: order.payment_status,
                        createdAt: order.createdAt.toLocaleDateString(),
                        totalAmount: order.totalAmount,
                        status: order.status
                    }))}
                />
            ) : (
                <ClientForm onSubmit={handleSubmit} orders={[]} />
            )}
        </div>
    );
}
