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
            <div className="group relative overflow-hidden rounded-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:border-blue-100 dark:hover:border-blue-900/50">
                {/* Изображение с синим оверлеем */}
                <div className="h-[400px] xl:h-[500px] relative overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>

                {/* Контент карточки */}
                <div className="p-6 flex-grow flex flex-col">
                    <div className="mb-5">
                        <h4 className="font-bold text-2xl mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {title}
                        </h4>
                        <p className="text-slate-600 dark:text-slate-300 text-justify line-clamp-3 mb-4">
                            {description}
                        </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                От {price.toLocaleString()} ₽
                            </p>
                        </div>
                        <Link
                            href={link}
                            className="flex items-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-3 px-6 transition-all duration-300 group/button shadow-md hover:shadow-blue-500/20"
                        >
                            <span className="font-medium">Купить</span>
                            <ArrowRight
                                size={18}
                                className="transition-transform duration-300 group-hover/button:translate-x-1"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
