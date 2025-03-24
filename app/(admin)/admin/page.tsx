import { ProductTypeChart } from "@/components/charts/products-chart";
import { SalesChart } from "@/components/charts/sales-chart";
import { TopClientsChart } from "@/components/charts/top-clients-chart";

export default async function AdminPage() {
    return (
        <div className="overflow-auto scrollbar py-5 h-[70vh]">
            Главная страница
            <div className="flex gap-10 flex-col">
                <div className="flex gap-10">
                    <TopClientsChart />
                    <SalesChart />
                </div>

                <ProductTypeChart />
            </div>
        </div>
    );
}
