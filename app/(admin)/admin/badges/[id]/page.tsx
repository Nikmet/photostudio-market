import { createProduct } from "@/app/actions";
import { BadgesForm } from "@/components/forms/badges-form/badges-form";
import { FormValuesBadges } from "@/components/forms/badges-form/schema";
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
                    name: data.name
                }
            });

            await createProduct(badge.id, badge.name, "Сувениры", await calcBadgePrice(), "badges");
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
            <h1>{findBadge?.id ? `Кружка | ${findBadge.id}` : `Новый значок | ${id}`}</h1>
            {findBadge ? (
                <BadgesForm onSubmit={handleSubmit} defaultValues={{ name: findBadge.name }} />
            ) : (
                <BadgesForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
