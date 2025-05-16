import { PromoCodesForm } from "@/components/admin-forms/promo-codes-form/promo-codes-form";
import { FormValuesPromoCode } from "@/components/admin-forms/promo-codes-form/schema";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function PromoCodesEditPage({ params }: Props) {
    const { id: resolvedId } = await params;
    const id = decodeURIComponent(resolvedId);

    const findCode = await prisma.promoCode.findFirst({
        where: {
            id: id
        }
    });

    const handleSubmit = async (data: FormValuesPromoCode) => {
        "use server";

        if (!findCode) {
            await prisma.promoCode.create({
                data: {
                    id: id,
                    code: data.code,
                    discount: data.discount
                }
            });
        } else {
            await prisma.promoCode.update({
                where: {
                    id: id
                },
                data: {
                    code: data.code,
                    discount: data.discount
                }
            });
        }

        redirect("/admin/promo-codes");
    };

    return (
        <div>
            <h1>{findCode?.id ? `Промокод | ${findCode.id}` : `Новый промокод | ${id}`}</h1>
            {findCode ? (
                <PromoCodesForm defaultValues={findCode} onSubmit={handleSubmit} href="/admin/promo-codes" id={id} />
            ) : (
                <PromoCodesForm onSubmit={handleSubmit} href="/admin/promo-codes" id={id} />
            )}
        </div>
    );
}
