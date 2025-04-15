import { ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "../ui";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import Link from "next/link";
import { CartContent } from "./cart-content";
import { cn } from "@/lib";
import React from "react";
import { Cart, Product, ProductItem } from "@prisma/client";

export type TCart = Cart & {
    items: (ProductItem & {
        product: Product;
    })[];
};

export interface ICartDrawerProps {
    className?: string;
    userId: string;
}

export const CartDrawer = ({ userId, className }: ICartDrawerProps): React.JSX.Element => {
    const [cart, setCart] = React.useState<TCart>();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    const fetchCart = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/cart/get-user-cart", {
                method: "POST",
                body: JSON.stringify({ id: userId })
            });
            const data = await res.json();
            setCart(data);
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        if (isOpen) {
            fetchCart();
        }
    }, [isOpen]);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <div>
                    <Button className="dark:text-white hidden md:flex">
                        Корзина <ArrowRight />
                    </Button>
                    <Button className="dark:text-white md:hidden h-7 w-7">
                        <ShoppingCart />
                    </Button>
                </div>
            </SheetTrigger>
            <SheetContent className={cn(className, "flex flex-col items-stretch h-full")}>
                <SheetHeader>
                    <SheetTitle>Корзина товаров</SheetTitle>
                </SheetHeader>
                <div className="flex-grow overflow-auto">
                    <CartContent
                        cart={cart}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        onCartUpdate={fetchCart} // Передаем функцию обновления в CartContent
                    />
                </div>
                <SheetFooter className="mt-auto flex flex-col gap-4">
                    <SheetClose asChild>
                        <Link
                            href="/checkout"
                            className={cn(
                                "w-full bg-primary text-white text-center py-2 rounded-md hover:bg-primary/90 transition-all duration-200",
                                isLoading && "bg-gray-300 pointer-events-none"
                            )}
                        >
                            Перейти к оформлению
                        </Link>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};
