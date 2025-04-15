import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface IProductCardProps {
    className?: string;
    imageUrl: string;
    title: string;
    price: number;
    description: string;
    link: string;
}

export const ProductCard = ({
    description,
    imageUrl,
    link,
    price,
    title,
    className
}: IProductCardProps): React.JSX.Element => {
    return (
        <div className={className}>
            <div className="shadow-md rounded-md p-4 bg-slate-50">
                <div className="h-[400px] mb-4">
                    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-bold text-2xl mb-2">{title}</h4>
                <p className="text-justify mb-4 italic">{description}</p>
                <div className="flex items-center justify-between">
                    <p className="text-lg font-light">от {price} руб.</p>
                    <Link
                        href={link}
                        className="flex gap-2 items-center justify-center bg-primary text-white rounded-md py-1 px-6 hover:opacity-90 transition-all duration-200"
                    >
                        Купить <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};
