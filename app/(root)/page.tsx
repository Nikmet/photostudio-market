import { ProductCard } from "@/components/product-card";
import { PromoSlider } from "@/components/promo/promo-slider";
import { CARDS } from "@/constants/cards";

export default function Home() {
    return (
        <div>
            <PromoSlider autoplayDelay={10000} showPagination={true} className="lg:block hidden" />    
            <div>
                <h2 className="text-3xl font-extrabold md:mt-10 mb-2">Наши продукты</h2>
                <div>
                    {CARDS.map((card, i) => (
                        <div key={i}>
                            <h3 className="text-2xl font-medium mb-10">{card.category}</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
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
