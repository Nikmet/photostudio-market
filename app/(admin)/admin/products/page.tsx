import { IColumnsProps } from "@/@types/column-props";
import { AdminTable } from "@/components/admin-components/admin-table";
import { prisma } from "@/prisma/prisma-client";

export default async function ProductsPage() {
    const productWithCategory = await prisma.product.findMany({
        include: {
            category: true
        }
    });

    if (!productWithCategory || productWithCategory.length === 0) {
        return (
            <div>
                <h2 className="text-2xl font-medium mb-10">Список всех продуктов</h2>
                <p>Продукты не найдены</p>
            </div>
        );
    }

    const flattenedData = productWithCategory.map(product => ({
        id: product.id,
        categoryName: product.category?.name || "Без категории",
        itemId: product.itemId,
        itemName: product.itemName,
        price: product.price
    }));

    const columns: IColumnsProps<(typeof flattenedData)[0]>[] = [
        { title: "Номер", key: "id" },
        { title: "Категория", key: "categoryName" },
        { title: "Номер продукта", key: "itemId" },
        { title: "Название продукта", key: "itemName" },
        { title: "Цена", key: "price" }
    ];

    return (
        <div>
            <h2 className="text-2xl font-medium mb-10">Список всех продуктов</h2>
            <AdminTable<(typeof flattenedData)[0]> data={flattenedData} route="products" columns={columns} />
        </div>
    );
}
