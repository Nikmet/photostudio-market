import { CARDS } from "@/constants/cards";
import { ProductCard } from "./product-card";

export interface ICardsGeneratorProps {
    tag: "Сувениры" | "Реклама" | "Рамки";
    className?: string;
}

export const CardsGenerator = ({ tag, className }: ICardsGeneratorProps): React.JSX.Element => {
    return (
        <div className={className}>
            {CARDS.filter(card => card.category == tag).map((card, i) => (
                <div key={i}>
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
    );
};
