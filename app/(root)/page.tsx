import { ProductCard } from "@/components/product-card";
import { CARDS } from "@/constants/cards";
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
                    {CARDS.map((card, i) => (
                        <div key={i}>
                            <h3 className="text-2xl font-medium mb-10">{card.category}</h3>
                            <div className="grid grid-cols-3 gap-5">
                                {card.products.map((product, i) => (
                                    <ProductCard
                                        key={i}
                                        title={product.title}
                                        description={product.description}
                                        price={product.price}
                                        imageUrl={product.imageUrl}
                                        link={product.link}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
