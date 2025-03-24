"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface Product {
    id: string;
    name: string;
}

const COLORS = [
    "#0088FE", // Синий
    "#4A90E2", // Голубой
    "#1E3A8A", // Темно-синий
    "#6366F1", // Индиго
    "#8B5CF6", // Фиолетовый
    "#A78BFA", // Светло-фиолетовый
    "#7C3AED", // Насыщенный фиолетовый
    "#4C1D95", // Темно-фиолетовый
    "#2563EB", // Ярко-синий
    "#3B82F6", // Небесно-синий
    "#60A5FA", // Светло-синий
    "#9333EA", // Пурпурный
    "#5B21B6", // Глубокий фиолетовый
    "#C4B5FD", // Пастельно-фиолетовый
    "#2E1065" // Темно-пурпурный
];
const prefixToName: Record<string, string> = {
    К: "Кружки",
    Ф: "Футболки",
    ЛГР: "Лазерная гравировка",
    ЗН: "Значки",
    МГ: "Магниты",
    П: "Печати",
    БАН: "Баннеры",
    СТ: "Стенды",
    Т: "Таблички",
    АА: "Адресные таблички",
    ИВ: "Информационные вывески",
    ШФП: "Широкоформатная печать",
    В: "Визитки",
    БАГ: "Багеты",
    РМ: "Рамки"
};

export const ProductTypeChart = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("/api/products/types");
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const getProductTypeData = () => {
        const typeCounts: Record<string, number> = {};

        products.forEach(product => {
            const dashIndex = product.id.indexOf("-");
            const prefix =
                dashIndex === -1 ? product.id.slice(0, 2).toUpperCase() : product.id.slice(0, dashIndex).toUpperCase();

            typeCounts[prefix] = (typeCounts[prefix] || 0) + 1;
        });

        return Object.entries(typeCounts).map(([prefix, count]) => ({
            name: prefixToName[prefix] || prefix,
            value: count,
            prefix
        }));
    };

    const chartData = getProductTypeData();

    if (loading) {
        return <div>Loading product data...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Card className="h-[600px]">
            <CardHeader>
                <CardTitle>Соотношение видов продукции</CardTitle>
                <CardDescription>Распределение по типам продуктов</CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name, props) => [
                                value,
                                `${props.payload.name} (${props.payload.prefix})`
                            ]}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
