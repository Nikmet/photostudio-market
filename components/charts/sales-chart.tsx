"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

interface Order {
    id: string;
    date: string; // Строка даты в формате ISO
    totalAmount: number;
    status: string;
}

export interface ISalesChartProps {
    className?: string;
}

const chartConfig = {
    sales: {
        label: "Продажи",
        color: "hsl(var(--primary))"
    }
} satisfies ChartConfig;

export const SalesChart = ({ className }: ISalesChartProps): React.JSX.Element => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [growthPercentage, setGrowthPercentage] = useState<number>(0);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("/api/orders");
                if (!response.ok) {
                    throw new Error("Не удалось получить заказы");
                }
                const data = (await response.json()) as Order[];
                setOrders(data);

                // Вычисляем процент роста, если у нас достаточно данных
                if (data.length >= 2) {
                    const currentMonthSales = data
                        .filter(
                            (order: Order) => format(parseISO(order.date), "yyyy-MM") === format(new Date(), "yyyy-MM")
                        )
                        .reduce((sum: number, order: Order) => sum + order.totalAmount, 0);

                    const prevMonthSales = data
                        .filter(
                            (order: Order) =>
                                format(parseISO(order.date), "yyyy-MM") ===
                                format(new Date(new Date().setMonth(new Date().getMonth() - 1)), "yyyy-MM")
                        )
                        .reduce((sum: number, order: Order) => sum + order.totalAmount, 0);

                    if (prevMonthSales > 0) {
                        const growth = ((currentMonthSales - prevMonthSales) / prevMonthSales) * 100;
                        setGrowthPercentage(Number(growth.toFixed(1)));
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Неизвестная ошибка");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Группируем заказы по месяцам и вычисляем общие продажи
    const getChartData = () => {
        if (!orders.length) return [];

        const monthlySales: Record<string, number> = {};

        orders.forEach(order => {
            const month = format(parseISO(order.date), "LLLL", { locale: ru }); // Полное название месяца на русском
            monthlySales[month] = (monthlySales[month] || 0) + order.totalAmount;
        });

        // Получаем последние 6 месяцев
        const months = [];
        for (let i = 0; i < 6; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            months.unshift(format(date, "LLLL", { locale: ru }));
        }

        return months.map(month => ({
            month,
            sales: monthlySales[month] || 0
        }));
    };

    const chartData = getChartData();

    if (loading) {
        return <div className={className}>Загрузка данных о продажах...</div>;
    }

    if (error) {
        return <div className={className}>Ошибка: {error}</div>;
    }

    return (
        <div className={className} style={{ width: "50%", height: "500px" }}>
            <Card className="w-full h-full flex flex-col">
                <CardHeader className="flex-shrink-0">
                    <CardTitle>Продажи</CardTitle>
                    <CardDescription>Последние 6 месяцев</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <ChartContainer config={chartConfig}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={value => value.slice(0, 3)}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent formatter={value => [`${value}`, "₽"]} />}
                                />
                                <Bar dataKey="sales" fill="var(--color-sales)" radius={[8, 8, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-shrink-0">
                    <div className="flex flex-col w-full gap-2 text-sm">
                        <div className="flex gap-2 font-medium leading-none">
                            {growthPercentage >= 0 ? "Тренд роста" : "Тренд падения"} на {Math.abs(growthPercentage)}%
                            {growthPercentage >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                                <TrendingUp className="h-4 w-4 transform rotate-180 text-red-500" />
                            )}
                        </div>
                        <div className="leading-none text-muted-foreground">
                            Показаны общие продажи за последние 6 месяцев
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};
