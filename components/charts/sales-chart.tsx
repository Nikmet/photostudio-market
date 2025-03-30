"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

                if (data.length >= 2) {
                    // Используем 1-е число месяца для корректного сравнения
                    const currentDate = new Date();
                    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    const prevMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

                    const currentMonthKey = format(currentMonthStart, "yyyy-MM");
                    const prevMonthKey = format(prevMonthStart, "yyyy-MM");

                    const currentMonthSales = data
                        .filter(order => format(parseISO(order.date), "yyyy-MM") === currentMonthKey)
                        .reduce((sum, order) => sum + order.totalAmount, 0);

                    const prevMonthSales = data
                        .filter(order => format(parseISO(order.date), "yyyy-MM") === prevMonthKey)
                        .reduce((sum, order) => sum + order.totalAmount, 0);

                    if (prevMonthSales > 0) {
                        const growth = ((currentMonthSales - prevMonthSales) / prevMonthSales) * 100;
                        setGrowthPercentage(Number(growth.toFixed(1)));
                    } else if (currentMonthSales > 0) {
                        setGrowthPercentage(100); // Рост от 0
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

        // Сначала группируем все заказы по месяцам
        orders.forEach(order => {
            const date = parseISO(order.date);
            const monthKey = format(date, "yyyy-MM"); // Используем год и месяц как ключ
            monthlySales[monthKey] = (monthlySales[monthKey] || 0) + order.totalAmount;
        });

        // Получаем последние 6 месяцев, правильно обрабатывая переходы
        const months = [];
        const currentDate = new Date();

        for (let i = 5; i >= 0; i--) {
            // Создаем дату на 1-е число нужного месяца, чтобы избежать проблем с разным количеством дней
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthKey = format(date, "yyyy-MM");
            const monthName = format(date, "LLLL", { locale: ru });

            months.push({
                month: monthName,
                sales: monthlySales[monthKey] || 0
            });
        }

        return months;
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
                <Card className="flex-shrink-0 p-4">
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
                </Card>
            </Card>
        </div>
    );
};
