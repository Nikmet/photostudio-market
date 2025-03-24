import { ProductTypeChart } from "@/components/charts/products-chart";
import { SalesChart } from "@/components/charts/sales-chart";
import { TopClientsChart } from "@/components/charts/top-clients-chart";

export default async function AdminPage() {
    return (
        <div className="overflow-auto scrollbar py-5 h-[70vh] pr-4">
            <h1 className="text-2xl font-bold mb-5">Главная страница (Отчеты)</h1>
            <div className="flex gap-10 flex-col">
                <div className="flex gap-10 h-[580px]">
                    <TopClientsChart />
                    <SalesChart />
                </div>

                <ProductTypeChart />
            </div>
        </div>
    );
}
