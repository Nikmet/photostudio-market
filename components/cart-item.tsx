import { cn } from "@/lib";
import { Product, ProductItem } from "@prisma/client";
import { Button } from "./ui/button"; // Предполагается, что у вас есть компонент Button
import { Minus, Plus, Trash } from "lucide-react";

export type TProductItem = ProductItem & {
    product: Product;
};

export interface ICartItemProps {
    className?: string;
    product: TProductItem & {
        product: Product;
    };
    onIncrement: (product: TProductItem) => void;
    onDecrement: (product: TProductItem) => void;
    onDelete: (product: TProductItem) => void;
}

export const CartItem = ({
    product,
    className,
    onIncrement,
    onDelete,
    onDecrement
}: ICartItemProps): React.JSX.Element => {
    return (
        <div className={cn(className, "bg-secondary p-4 rounded-md flex gap-4 items-center relative")}>
            <div className="flex-1 flex flex-col gap-4">
                <h4 className="text-lg font-semibold">{product.product.itemName}</h4>
                <div
                    className="absolute right-4 cursor-pointer hover:opacity-60 transition-all duration-200"
                    onClick={() => onDelete(product)}
                >
                    <Trash size={20} />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDecrement(product)}
                            disabled={product.count <= 1}
                            className="h-6 w-6 p-0 bg-red-300 border-red-900 hover:bg-red-400 text-red-900"
                        >
                            <Minus size={13} />
                        </Button>
                        <span className="w-8 text-center">{product.count}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onIncrement(product)}
                            className="h-6 w-6 p-0 bg-green-300 border-green-900 hover:bg-green-400 text-green-900"
                        >
                            <Plus size={13} />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                            {product.product.price} X {product.count}
                        </span>
                        <span className="text-muted-foreground">=</span>
                        <span className="font-medium">{product.total} ₽</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
