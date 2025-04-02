import { prisma } from "@/prisma/prisma-client";

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

    return (
        <div>
            <h1>{pageData?.title}</h1>
            {pageData?.content}
        </div>
    );
}
