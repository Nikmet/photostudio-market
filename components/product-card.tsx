import Link from "next/link";
import { Button } from "./ui";
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
            <Link href={"/" + link}>
                <div className="shadow-md rounded-md p-4 bg-slate-50">
                    <div className="h-[400px] mb-4">
                        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-bold text-2xl mb-2">{title}</h4>
                    <p className="text-justify mb-4 italic">{description}</p>
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-light">от {price} руб.</p>
                        <Button className="w-[100px]">
                            Купить <ArrowRight />
                        </Button>
                    </div>
                </div>
            </Link>
        </div>
    );
};
