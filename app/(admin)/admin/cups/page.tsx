import { AdminTable } from "@/components/admin-table";
import { Cup } from "@prisma/client";
import React from "react";

interface IColumnsProps {
    title: string;
    key: keyof Cup;
}

export default async function CupPage() {
    const cups = await fetch("http://localhost:3000/api/cup").then(res => res.json());

    const columns: IColumnsProps[] = [
        { title: "Номер", key: "id" },
        { title: "Название", key: "name" },
        { title: "Изображение", key: "printing_image" }
    ];

    return (
        <div className="p-3">
            <h2 className="text-2xl font-medium mb-10">Список кружек</h2>
            <AdminTable<Cup> data={cups} route="cups" className="" columns={columns} />
        </div>
    );
}
