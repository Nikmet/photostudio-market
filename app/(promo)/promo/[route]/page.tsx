import { prisma } from "@/prisma/prisma-client";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
    params: Promise<{
        route: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const route = decodeURIComponent(resolvedParams.route);

    const pageData = await prisma.promotionPage.findFirst({
        where: { route },
        select: {
            title: true,
            alt: true,
            image: true
        }
    });

    if (!pageData) {
        return {
            title: "Акция не найдена",
            description: "Страница акции не существует или была удалена"
        };
    }

    return {
        title: pageData.title || "Акция",
        description: pageData.alt || "Специальное предложение",
        openGraph: {
            title: pageData.title || "Акция",
            description: pageData.alt || "Специальное предложение",
            images: pageData.image ? [{ url: pageData.image }] : undefined,
            type: "website"
        },
        twitter: {
            card: "summary_large_image",
            title: pageData.title || "Акция",
            description: pageData.alt || "Специальное предложение",
            images: pageData.image ? [{ url: pageData.image }] : undefined
        }
    };
}

export default async function PromoPage({ params }: Props) {
    const resolvedParams = await params;
    const route = decodeURIComponent(resolvedParams.route);

    const pageData = await prisma.promotionPage.findFirst({
        where: { route }
    });

    if (!pageData) {
        notFound();
    }

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold">{pageData.title}</h1>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: pageData.content || "" }} />
        </div>
    );
}
