import { uploadImage } from "@/app/actions";
import { PromoForm } from "@/components/forms/promo-form/promo-form";
import { FormValuesPromo } from "@/components/forms/promo-form/schema";
import { PageTitle } from "@/components/page-title";
import { getImage } from "@/lib/image";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function CupsEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findPage = await prisma.promotionPage.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (data: FormValuesPromo) => {
        "use server";

        if (!findPage) {
            await prisma.promotionPage.create({
                data: {
                    id: id,
                    title: data.title,
                    content: data.content,
                    route: data.route,
                    alt: data.alt,
                    image: await uploadImage(data.image)
                }
            });
        } else {
            await prisma.promotionPage.update({
                where: {
                    id: id
                },
                data: {
                    title: data.title,
                    content: data.content,
                    route: data.route,
                    alt: data.alt,
                    image: await uploadImage(data.image)
                }
            });
        }

        redirect("/admin/promo");
    };

    return (
        <div>
            <PageTitle>{findPage?.id ? `Промо-страница | ${findPage.id}` : `Новая промо-страница | ${id}`}</PageTitle>

            {findPage ? (
                <PromoForm
                    onSubmit={handleSubmit}
                    defaultValues={{
                        title: findPage.title,
                        content: findPage.content,
                        route: findPage.route,
                        alt: findPage.alt,
                        image: await getImage(findPage.image)
                    }}
                />
            ) : (
                <PromoForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
