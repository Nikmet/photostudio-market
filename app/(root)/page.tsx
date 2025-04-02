import { ProductCard } from "@/components/product-card";
import Link from "next/link";

export default function Home() {
    return (
        <div>
            <div className="border border-slate-400">
                <Link className="h-[250px] rounded-md" href={"/promo/spring-with-us"}>
                    <img
                        src={`${process.env.NEXT_PUBLIC_URL}/promo.png`}
                        alt="Весна с нами, получи скидку 15%"
                        className="w-full h-full object-cover"
                    />
                </Link>
            </div>
            <div>
                <h2 className="text-3xl font-extrabold mt-10 mb-2">Наши продукты</h2>
                <div>
                    <h3 className="text-2xl font-medium mb-10">Сувениры</h3>
                    <div className="grid grid-cols-3 gap-5">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <ProductCard
                                key={i}
                                title="Кружка"
                                description="Стильная керамическая кружка с нанесенным логотипом. Идеально подходит для горячих напитков, имеет удобную ручку и прочное покрытие. Объем 330 мл."
                                price={100}
                                imageUrl={`${process.env.NEXT_PUBLIC_URL}/cup.png`}
                                link={"cups"}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
