import React from "react";
import { ThemeImage } from "../theme-image";
import { ArrowLeft } from "lucide-react";
import { SheetClose } from "../ui/sheet";
import { CartItem, TProductItem } from "./cart-item";
import { cn } from "@/lib";
import { TCart } from "./cart-drawer";
import { Button } from "../ui";

export interface ICartContentProps {
    className?: string;
    isLoading: boolean;
    cart?: TCart;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    onCartUpdate: () => Promise<void>; // Добавляем callback для обновления корзины
}

export const CartContent = ({
    cart,
    isLoading,
    setIsLoading,
    onCartUpdate,
    className
}: ICartContentProps): React.JSX.Element => {
    const [cartState, setCartState] = React.useState<TCart | null>(cart || null);

    React.useEffect(() => {
        setCartState(cart || null);
    }, [cart]);

    const handleCartAction = async (action: () => Promise<Response>) => {
        try {
            setIsLoading(true);
            const response = await action();

            if (response.ok) {
                await onCartUpdate(); // Используем переданную функцию для обновления
            }
        } catch (error) {
            console.error("Error performing cart action:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const onIncrement = async (product: TProductItem) => {
        await handleCartAction(() =>
            fetch("/api/cart/increment-product", {
                method: "POST",
                body: JSON.stringify({ id: product.id })
            })
        );
    };

    const onDecrement = async (product: TProductItem) => {
        await handleCartAction(() =>
            fetch("/api/cart/decrement-product", {
                method: "POST",
                body: JSON.stringify({ id: product.id })
            })
        );
    };

    const onDelete = async (product: TProductItem) => {
        await handleCartAction(() =>
            fetch("/api/cart/delete", {
                method: "POST",
                body: JSON.stringify({ id: product.id })
            })
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="loader"></div>
            </div>
        );
    }

    if (!cartState || !cartState.items?.length) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 h-full p-4">
                <ThemeImage
                    darkSrc="/empty-cart-dark.png"
                    lightSrc="/empty-cart-light.png"
                    alt="Корзина пуста"
                    className="h-32 w-32 object-contain"
                />
                <p className="text-center text-muted-foreground">Ваша корзина пуста</p>
                <SheetClose asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                        <ArrowLeft size={16} />
                        Перейти к выбору товаров
                    </Button>
                </SheetClose>
            </div>
        );
    }

    return (
        <div className={cn(className, "flex flex-col gap-4 h-full")}>
            <div className="flex-1 overflow-y-auto space-y-4">
                {cartState.items.map(item => (
                    <CartItem
                        key={item.id}
                        product={item}
                        onDecrement={() => onDecrement(item)}
                        onIncrement={() => onIncrement(item)}
                        onDelete={() => onDelete(item)}
                    />
                ))}
            </div>

            <div className="border-t pt-4 mt-auto">
                <div className="flex items-center justify-between">
                    <span className="font-medium">Итого:</span>
                    <span className="font-bold text-lg">{cartState.totalAmount.toLocaleString()} ₽</span>
                </div>
            </div>
        </div>
    );
};
