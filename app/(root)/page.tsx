import { ProductCard } from "@/components/product-card";
import { PromoSlider } from "@/components/promo/promo-slider";
import { CARDS } from "@/constants/cards";

export default function Home() {
    return (
        <div className="pb-12">
            <PromoSlider autoplayDelay={10000} showPagination={true} className="lg:block hidden" />

            <div className="mx-auto px-4 mt-8 md:mt-12">
                {/* Главный заголовок с градиентом */}
                <h2 className="text-3xl md:text-4xl font-bold mb-10 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Наши продукты
                </h2>

                {/* Список категорий */}
                <div className="space-y-14">
                    {CARDS.map((card, i) => (
                        <section key={i} className="relative">
                            {/* Заголовок категории с акцентным элементом */}
                            <div className="flex items-center mb-8">
                                <div className="w-3 h-8 bg-indigo-500 rounded-full mr-3"></div>
                                <h3 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200">
                                    {card.category}
                                </h3>
                            </div>

                            {/* Сетка продуктов */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
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
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}
