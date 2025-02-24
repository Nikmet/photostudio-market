import { AdminTable } from "@/components/admin-table";
import { prisma } from "@/prisma/prisma-client";

interface IColumnsPropsWithCategory<T> {
    title: string;
    key: keyof T;
}

export default async function AdminPage() {
    const productWithCategory = await prisma.product.findMany({
        include: {
            category: true
        }
    });

    const flattenedData = productWithCategory.map(product => ({
        ...product,
        categoryName: product.category.name
    }));

    console.log(productWithCategory);

    if (!productWithCategory) {
        throw new Error("Продукты не найдены");
    }

    const columns: IColumnsPropsWithCategory<(typeof flattenedData)[0]>[] = [
        { title: "Номер", key: "id" },
        { title: "Категория", key: "categoryName" },
        { title: "Номер продукта", key: "itemId" },
        { title: "Название продукта", key: "itemName" },
        { title: "Цена", key: "price" }
    ];

    return (
        <div className="p-3">
            <h2 className="text-2xl font-medium mb-10">Список всех продуктов</h2>
            <AdminTable<(typeof flattenedData)[0]> data={flattenedData} route="product" columns={columns} />
        </div>
    );
}
