import { createProduct } from "@/app/actions";
import { BannerForm, FormValuesBanner } from "@/components/forms/banner-form";
import { prisma } from "@/prisma/prisma-client";
import { BannerDensity } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function BannersEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findBanner = await prisma.banner.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (data: FormValuesBanner) => {
        "use server";

        console.log(data);

        if (!findBanner) {
            const banner = await prisma.banner.create({
                data: {
                    id: id,
                    name: data.name,
                    density: data.density as BannerDensity,
                    height: data.height,
                    width: data.width,
                    luvers_count: data.luvers_count,
                    luvers_step: data.luvers_step
                }
            });

            await createProduct(banner.id, banner.name, "Реклама", 450);
        }

        await prisma.banner.update({
            where: {
                id: id
            },
            data: {
                name: data.name,
                density: data.density as BannerDensity,
                height: data.height,
                width: data.width,
                luvers_count: data.luvers_count,
                luvers_step: data.luvers_step
            }
        });
        redirect("/admin/banners");
    };

    return (
        <div>
            <h1>{findBanner?.id ? `Банер | ${findBanner.id}` : `Новый банер | ${id}`}</h1>
            {findBanner ? (
                <BannerForm
                    onSubmit={handleSubmit}
                    defaultValues={{
                        name: findBanner?.name,
                        density: findBanner?.density,
                        height: findBanner?.height,
                        width: findBanner?.width,
                        luvers_count: findBanner?.luvers_count,
                        luvers_step: findBanner?.luvers_step
                    }}
                />
            ) : (
                <BannerForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
