"use client";

import { cn } from "@/lib";
import { IOrderProps } from "../admin-forms/clients-form/client-form";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { formatTableCell } from "@/lib/format-table-cell";
import { Badge } from "../ui/badge";

export interface IOrdersListProps {
    className?: string;
    orders: IOrderProps[];
}

export const OrdersList = ({ orders, className }: IOrdersListProps): React.JSX.Element => {
    const [visibleCount, setVisibleCount] = useState(3);

    const showMore = () => setVisibleCount(prev => prev + 3);

    return (
        <div className={cn("space-y-4", className)}>
            {orders.slice(0, visibleCount).map(order => (
                <div key={order.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-medium">Заказ #{order.id}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {order.createdAt}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold">{order.totalAmount} ₽</p>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Статус:</span>
                            <Badge>{formatTableCell<string>(order.status)}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Оплата:</span>
                            <Badge>{formatTableCell<string>(order.payment_status)}</Badge>
                        </div>
                    </div>
                </div>
            ))}

            {visibleCount < orders.length && (
                <Button variant="ghost" onClick={showMore} className="w-full mt-4 flex items-center gap-1">
                    Показать еще ({orders.length - visibleCount})
                    <ChevronDown className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
};
