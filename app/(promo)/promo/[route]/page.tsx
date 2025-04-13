import { prisma } from "@/prisma/prisma-client";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{
        route: string;
    }>;
}

export default async function PromoPage({ params }: Props) {
    const { route: resolvedId } = await params;
    const route = decodeURIComponent(resolvedId);

    const pageData = await prisma.promotionPage.findFirst({
        where: {
            route
        }
    });

    if (!pageData) {
        notFound();
    }

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold">{pageData?.title}</h1>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: pageData?.content || "" }} />
        </div>
    );
}
