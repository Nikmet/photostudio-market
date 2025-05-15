import { createProduct, updateProduct, uploadImage } from "@/app/actions";
import { BadgesForm } from "@/components/admin-forms/badges-form/badges-form";
import { FormValuesBadges } from "@/components/admin-forms/badges-form/schema";
import { getImage } from "@/lib/image";
import { calcBadgePrice } from "@/lib/prices";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function BadgesEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findBadge = await prisma.badge.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (data: FormValuesBadges) => {
        "use server";

        if (!findBadge) {
            const badge = await prisma.badge.create({
                data: {
                    id: id,
                    name: data.name,
                    printing_image: await uploadImage(data.printing_image)
                }
            });

            await createProduct(badge.id, badge.name, "Сувениры", await calcBadgePrice(), "badges");
        } else {
            const updatedBadge = await prisma.badge.update({
                where: {
                    id: id
                },
                data: {
                    name: data.name,
                    printing_image: await uploadImage(data.printing_image)
                }
            });
            await updateProduct(updatedBadge.id, updatedBadge.name, await calcBadgePrice());
        }

        await prisma.badge.update({
            where: {
                id: id
            },
            data: {
                name: data.name
            }
        });
        redirect("/admin/badges");
    };

    return (
        <div>
            <h1>{findBadge?.id ? `Значки (50шт.) | ${findBadge.id}` : `Новые значки (50шт.) | ${id}`}</h1>
            {findBadge ? (
                <BadgesForm
                    onSubmit={handleSubmit}
                    defaultValues={{ name: findBadge.name, printing_image: await getImage(findBadge.printing_image) }}
                    href="/admin/badges"
                    id={id}
                />
            ) : (
                <BadgesForm onSubmit={handleSubmit} href="/admin/badges" id={id} />
            )}
        </div>
    );
}
