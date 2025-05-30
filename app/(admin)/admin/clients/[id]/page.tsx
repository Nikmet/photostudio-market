import { uploadImage } from "@/app/actions";
import { ClientForm } from "@/components/admin-forms/clients-form/client-form";
import { FormValuesClients } from "@/components/admin-forms/clients-form/schema";
import { PageTitle } from "@/components/page-title";
import { getImage } from "@/lib/image";
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

        if (!findClient) {
            await prisma.user.create({
                data: {
                    id: id,
                    fullName: data.fullName,
                    email: data.email,
                    phone: data.phone,
                    role: "USER" as UserRole,
                    password: "",
                    photo: await uploadImage(data.photo)
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
                    password: "",
                    photo: await uploadImage(data.photo)
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
                        email: findClient.email,
                        photo: await getImage(findClient.photo)
                    }}
                    orders={findClient.orders.map(order => ({
                        id: order.id,
                        payment_status: order.payment_status,
                        createdAt: order.createdAt.toLocaleDateString(),
                        totalAmount: order.totalAmount,
                        status: order.status
                    }))}
                    href="/admin/clients"
                    id={id}
                />
            ) : (
                <ClientForm onSubmit={handleSubmit} orders={[]} href="/admin/clients" id={id} />
            )}
        </div>
    );
}
