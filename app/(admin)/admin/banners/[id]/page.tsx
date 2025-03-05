import { createProduct } from "@/app/actions";
import { BannerForm } from "@/components/forms/banner-form/banner-form";
import { FormValuesBanner } from "@/components/forms/banner-form/schema";
import { PageTitle } from "@/components/page-title";
import { imageToFile } from "@/lib/image-to-file";
import { calcBannerPrice } from "@/lib/prices";
import { uploadImage } from "@/lib/upload-image";
import { prisma } from "@/prisma/prisma-client";
import { BannerDensity, Image } from "@prisma/client";
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
        },
        include: {
            printing_image: true
        }
    });

    const handleSubmit = async (data: FormValuesBanner) => {
        "use server";

        let printing_image: Image | undefined;

        // Загружаем изображение, если оно есть
        if (data.printing_image) {
            printing_image = await uploadImage(data.printing_image);
        }

        if (!findBanner) {
            const banner = await prisma.banner.create({
                data: {
                    id: id,
                    name: data.name,
                    density: data.density as BannerDensity,
                    height: data.height,
                    width: data.width,
                    luvers_count: data.luvers_count,
                    luvers_step: data.luvers_step,
                    printing_image: printing_image
                        ? {
                              connect: {
                                  id: printing_image.id
                              }
                          }
                        : undefined
                }
            });

            await createProduct(banner.id, banner.name, "Реклама", await calcBannerPrice(banner), "banners");
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
                luvers_step: data.luvers_step,
                printing_image: printing_image
                    ? {
                          connect: {
                              id: printing_image.id
                          }
                      }
                    : undefined
            }
        });
        redirect("/admin/banners");
    };

    return (
        <div>
            <PageTitle>{findBanner?.id ? `Банер | ${findBanner.id}` : `Новый банер | ${id}`}</PageTitle>
            {findBanner ? (
                <BannerForm
                    onSubmit={handleSubmit}
                    defaultValues={{
                        name: findBanner?.name,
                        density: findBanner?.density,
                        height: findBanner?.height,
                        width: findBanner?.width,
                        luvers_count: findBanner?.luvers_count,
                        luvers_step: findBanner?.luvers_step,
                        printing_image: imageToFile(findBanner.printing_image)
                    }}
                />
            ) : (
                <BannerForm onSubmit={handleSubmit} />
            )}
        </div>
    );
}
