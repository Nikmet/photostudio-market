import React from "react";
import { ThemeImage } from "../theme-image";
import { ArrowLeft } from "lucide-react";
import { SheetClose } from "../ui/sheet";
import { CartItem, TProductItem } from "./cart-item";
import { cn } from "@/lib";
import { TCart } from "./cart-drawer";

export interface ICartContentProps {
    className?: string;
    isLoading: boolean;
    cart?: TCart;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CartContent = ({ cart, isLoading, setIsLoading, className }: ICartContentProps): React.JSX.Element => {
    const [cartState, setCartState] = React.useState<TCart | null>(cart || null);

    React.useEffect(() => {
        setIsLoading(true);
        setCartState(cart || null);
        setIsLoading(false);
    }, [cart]);

    const onIncrement = async (product: TProductItem) => {
        try {
            setIsLoading(true);

            const response = await fetch("/api/cart/increment-product", {
                method: "POST",
                body: JSON.stringify({ id: product.id })
            });

            if (response.ok) {
                const { cart: updatedCart } = await response.json();

                setCartState(updatedCart);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error incrementing product:", error);
        }
    };

    const onDecrement = async (product: TProductItem) => {
        try {
            setIsLoading(true);

            const response = await fetch("/api/cart/decrement-product", {
                method: "POST",
                body: JSON.stringify({ id: product.id })
            });

            if (response.ok) {
                const { cart: updatedCart } = await response.json();
                setCartState(updatedCart);
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error decrementing product:", error);
        }
    };

    const onDelete = async (product: TProductItem) => {
        try {
            setIsLoading(true);

            const response = await fetch("/api/cart/delete", {
                method: "POST",
                body: JSON.stringify({ id: product.id })
            });

            if (response.ok) {
                const { cart: updatedCart } = await response.json();
                setCartState(updatedCart);
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    if (isLoading)
        return (
            <div className="flex items-center justify-center h-full">
                <div className="loader"></div>
            </div>
        );

    // Проверяем cartState и cartState.items
    if (!cartState || cartState.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 h-full">
                <ThemeImage
                    darkSrc="empty-cart-dark.png"
                    lightSrc="empty-cart-light.png"
                    alt="empty cart"
                    className="h-[100px] "
                />
                <SheetClose asChild>
                    <div className="text-center flex gap-1 hover:gap-2 transition-all duration-200 cursor-pointer">
                        <ArrowLeft /> Перейти к выбору
                    </div>
                </SheetClose>
            </div>
        );
    }

    // Добавляем проверку перед использованием .map()
    return (
        <div className={cn(className, "flex flex-col gap-2 h-full")}>
            {cartState.items?.map?.(item => (
                <CartItem
                    key={item.id}
                    product={item}
                    onDecrement={() => onDecrement(item)}
                    onIncrement={() => onIncrement(item)}
                    onDelete={() => onDelete(item)}
                />
            ))}
            <div className="flex items-center w-full mt-auto">
                <span className="whitespace-nowrap">Итого:</span>
                <span className="border-b border-dashed border-slate-400 flex-1 mx-2 translate-y-[4px]"></span>
                <span className="whitespace-nowrap">{cartState.totalAmount} ₽</span>
            </div>
        </div>
    );
};
