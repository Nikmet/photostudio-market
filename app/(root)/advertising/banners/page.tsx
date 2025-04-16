import { createProduct, creteProductItem, uploadImage } from "@/app/actions";
import { FormValuesBanner } from "@/components/admin-forms/banner-form/schema";
import { BannerClientForm } from "@/components/client-forms/banners-client-form";
import { PageTitle } from "@/components/page-title";
import { calcBannerPrice } from "@/lib/prices";
import { createUid } from "@/lib/uid";
import { prisma } from "@/prisma/prisma-client";
import { BannerDensity } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function BannersClientPage() {
    let id;

    const lastId = (
        await prisma.banner.findFirst({
            orderBy: {
                id: "desc"
            }
        })
    )?.id;

    if (!lastId) {
        id = createUid("БАН", "1");
    } else {
        id = createUid("БАН", (Number(lastId.split("-")[1]) + 1).toString());
    }

    const handleSubmit = async (data: FormValuesBanner, userId: string) => {
        "use server";

        const banner = await prisma.banner.create({
            data: {
                id: id,
                name: data.name,
                density: data.density as BannerDensity,
                height: data.height,
                width: data.width,
                luvers_count: data.luvers_count,
                luvers_step: data.luvers_step,
                printing_image: await uploadImage(data.printing_image)
            }
        });

        const product = await createProduct(
            banner.id,
            banner.name,
            "Реклама",
            await calcBannerPrice(banner),
            "banners"
        );

        if (!product) {
            throw new Error("Не удалось создать продукт");
        }

        const cart = creteProductItem(product, userId);

        if (!cart) {
            throw new Error("Не удалось создать продукт в корзине");
        }

        redirect("/");
    };

    return (
        <div>
            <PageTitle>{`Новый баннер | ${id}`}</PageTitle>
            <BannerClientForm onSubmit={handleSubmit} id={id} />
        </div>
    );
}
