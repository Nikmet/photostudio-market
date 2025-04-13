"use client";

import React, { useState, useMemo } from "react";
import { ProductTypeChart } from "./products-chart";
import { SalesChart } from "./sales-chart";
import { TopClientsChart } from "./top-clients-chart";

export interface IChartsProps {
    className?: string;
}

export const Charts = ({ className }: IChartsProps): React.JSX.Element => {
    const [loadingStates, setLoadingStates] = useState({
        sales: true,
        clients: true,
        products: true
    });

    const handleLoaded = (chart: keyof typeof loadingStates) => {
        setLoadingStates(prev => ({ ...prev, [chart]: false }));
    };

    const isLoading = useMemo(() => Object.values(loadingStates).some(state => state), [loadingStates]);

    return (
        <div className={className}>
            {isLoading && (
                <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
                    <div className="loader"></div>
                </div>
            )}
            <div className="flex gap-10 flex-col">
                <div className="flex gap-10 h-[590px]">
                    <TopClientsChart onLoaded={() => handleLoaded("clients")} />
                    <SalesChart onLoaded={() => handleLoaded("sales")} />
                </div>
                <ProductTypeChart onLoaded={() => handleLoaded("products")} />
            </div>
        </div>
    );
};
