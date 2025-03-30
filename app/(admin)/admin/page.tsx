import { Charts } from "@/components/charts/charts";

export default async function AdminPage() {
    return (
        <div className="overflow-auto scrollbar py-5 h-[75vh] pr-4">
            <h1 className="text-2xl font-bold mb-5">Главная страница (Отчеты)</h1>
            <Charts />
        </div>
    );
}
