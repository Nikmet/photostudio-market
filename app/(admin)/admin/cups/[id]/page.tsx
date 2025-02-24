import { Input } from "@/components/ui/input";
import { prisma } from "@/prisma/prisma-client";

interface Props {
    params: {
        hash: string;
    };
}

export default async function CupsEditPage({ params }: Props) {
    const findCup = await prisma.cup.findFirst({
        where: {
            id: params.hash
        }
    });

    if (!findCup) {
        return <div>Кружка не найдена</div>;
    }

    return (
        <div>
            <h1>Кружка - #{findCup.id}</h1>
            <form action="" className="flex gap-2">
                <img
                    src="https://www.adverti.ru/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/4/6/4662_5.jpg"
                    alt="кружка"
                    width={500}
                    height={500}
                    className="rounded-md border border-gray-300"
                />
                <div className="flex gap-2">
                    <Input type="text" placeholder="Название" value={findCup.name} />
                </div>
            </form>
        </div>
    );
}
