import { createProduct } from "@/app/actions";
import { FramesForm } from "@/components/forms/frames-form/frames-form";
import { FormValuesFrames } from "@/components/forms/frames-form/schema";
import { PageTitle } from "@/components/page-title";
import { calcFramePrice } from "@/lib/prices";
import { createUid, getId } from "@/lib/uid";
import { prisma } from "@/prisma/prisma-client";
import { redirect } from "next/navigation";

export default async function FramesEditPage() {
    const data = await prisma.frame.findMany();
    let uid: string;
    if (data.length === 0) {
        uid = createUid("РМ", "1");
    }

    const maxId = Math.max(...data.map(item => Number(getId(item.id))));
    const newId = (maxId + 1).toString();
    uid = createUid("РМ", newId);

    const baguettes = await prisma.baguette.findMany();

    const handleSubmit = async (data: FormValuesFrames) => {
        "use server";

        const findBaguette = await prisma.baguette.findFirst({
            where: {
                id: data.baguetteId
            }
        });

        const frame = await prisma.frame.create({
            data: {
                id: uid,
                name: data.name,
                width: data.width,
                height: data.height,
                has_glass: data.has_glass,
                has_backdrop: data.has_backdrop,
                has_suspension: data.has_suspension,
                image: findBaguette?.image,
                baguette: {
                    connect: {
                        id: findBaguette?.id
                    }
                }
            }
        });

        console.log(frame);

        await createProduct(frame.id, frame.name, "Рамки", await calcFramePrice(frame), "frames");

        console.log(frame);

        redirect("/frames");
    };

    return (
        <div>
            <PageTitle>Новая рамка</PageTitle>
            <FramesForm onSubmit={handleSubmit} baguettes={baguettes} isClient={true} />
        </div>
    );
}
