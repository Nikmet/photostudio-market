"use client";

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface Client {
    id: string;
    fullName: string;
    totalSpent: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background p-4 border rounded shadow-sm max-w-[300px]">
                <p className="font-medium break-words">{label}</p>
                <p className="text-primary">{`Сумма: ${payload[0].value.toLocaleString()}₽`}</p>
            </div>
        );
    }
    return null;
};

export interface ITopClientsChartProps {
    onLoaded: () => void;
}

export function TopClientsChart({ onLoaded }: ITopClientsChartProps) {
    const [clients, setClients] = useState<Client[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopClients = async () => {
            try {
                const response = await fetch("/api/users/top");
                if (!response.ok) {
                    throw new Error("Failed to fetch top clients");
                }
                const data = await response.json();
                setClients(data.slice(0, 5));
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                onLoaded();
            }
        };

        fetchTopClients();
    }, [onLoaded]);

    if (error) return <div>Error: {error}</div>;

    const chartData = clients.map(client => ({
        name: client.fullName,
        value: client.totalSpent
    }));

    if (chartData.length === 0) return <div>No client data available</div>;

    return (
        <Card className="w-[50%] min-w-[500px] h-[590px]">
            <CardHeader>
                <CardTitle>Топ-5 клиентов по прибыльности</CardTitle>
                <CardDescription>Клиенты с наибольшим объемом заказов</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                        <CartesianGrid horizontal={false} vertical={true} stroke="#eee" strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            tickFormatter={value => `${value.toLocaleString()}₽`}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            width={150}
                            tick={{ fontSize: 12 }}
                            interval={0}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: "transparent" }}
                            wrapperStyle={{ zIndex: 100 }}
                        />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
