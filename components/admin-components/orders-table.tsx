//TODO Ошибка с корзиной
"use client";

import { usePagination } from "@/hooks/use-pagination";
import { useSelection } from "@/hooks/use-selection";
import { useSort } from "@/hooks/use-sort";
import { cn } from "@/lib";
import { Button } from "../ui";
import { ArrowDown, ArrowUp, Minus, Plus } from "lucide-react"; // Добавляем иконки
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { IColumnsProps } from "@/@types/column-props";
import { formatTableCell } from "@/lib/format-table-cell";
import { Pagination } from "./pagination";
import { EmptyTable } from "./empty-table";
import React from "react";
import { Difficile, Product, ProductItem } from "@prisma/client";
import { SelectedProductWindow } from "./selected-product-window";
import { useTableActions } from "@/hooks/use-table-actions";

export type ProductItemWithProduct = ProductItem & {
    createdAt: Date;
    updatedAt: Date;
    price: number;
    design: boolean;
    design_difficulty: Difficile;
    categoryId: number;
    itemId: string;
    itemName: string;
    comments: string | null;
    route: string;
};

export interface IOrdersTableProps {
    className?: string;
    data?: ProductItemWithProduct[];
    totalProp?: number;
    rows_count?: number;
    onProductsChange?: (products: ProductItemWithProduct[]) => void;
}

export const OrdersTable = ({
    data,
    rows_count,
    totalProp,
    onProductsChange,
    className
}: IOrdersTableProps): React.JSX.Element => {
    const [products, setProducts] = React.useState<ProductItemWithProduct[]>(data ?? []);
    const { sortConfig, handleSort } = useSort<ProductItemWithProduct>(products);
    const { selected, handleSelect, clearSelection } = useSelection();
    const [productsForTable, setProductsForTable] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [total, setTotal] = React.useState<number>(totalProp ?? 0);
    const [addWindow, setAddWindow] = React.useState(false);
    const { redirectToPage } = useTableActions(
        products.map(product => ({ id: product.itemId })),
        "products"
    );

    const sortedData = React.useMemo(() => {
        if (!sortConfig.key) return products;

        return [...products].sort((a, b) => {
            const aValue = a[sortConfig.key as keyof ProductItemWithProduct] as any;
            const bValue = b[sortConfig.key as keyof ProductItemWithProduct] as any;

            if (aValue < bValue) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    }, [products, sortConfig]);

    const {
        currentItems: currentSortedItems,
        currentPage,
        totalPages,
        paginate
    } = usePagination(sortedData, rows_count ?? 15);

    const calculateTotal = (products: ProductItemWithProduct[]) => {
        return products.reduce((acc, item) => acc + item.total, 0);
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/products");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    };

    React.useEffect(() => {
        if (data) {
            setProducts(data);
            setTotal(calculateTotal(data));
        }
    }, [data]);

    React.useEffect(() => {
        if (productsForTable.length > 0) {
            setLoading(false);
            setAddWindow(true);
        }
    }, [productsForTable]);

    React.useEffect(() => {
        if (onProductsChange) {
            onProductsChange(products);
        }
    }, [products, onProductsChange]);

    const handleAdd = () => {
        setLoading(true);
        const fetchAndSetProducts = async () => {
            const products: Product[] = await fetchProducts();
            setProductsForTable(products);
        };
        fetchAndSetProducts();
    };

    const handleAddProduct = (product: Product) => {
        const updatedProducts = [...products];
        const existingProduct = updatedProducts.find(item => item.itemId === product.itemId);

        if (existingProduct) {
            existingProduct.count += 1;
            existingProduct.total = existingProduct.count * existingProduct.price;
        } else {
            updatedProducts.push({
                id: updatedProducts.length + 1,
                productId: product.id,
                itemName: product.itemName,
                price: product.price,
                count: 1,
                total: product.price,
                createdAt: new Date(),
                updatedAt: new Date(),
                design: false,
                design_difficulty: Difficile.EASY,
                categoryId: 1,
                itemId: product.itemId,
                comments: null,
                route: "ПР",
                orderId: null
            });
        }

        setProducts(updatedProducts);
        setTotal(calculateTotal(updatedProducts));
        setAddWindow(false);
    };

    const handleChangeQuantity = (productId: string, delta: number) => {
        setProducts(prevProducts =>
            prevProducts.map(item => {
                if (item.productId === productId) {
                    const newCount = item.count + delta;
                    const newTotal = newCount * item.price;

                    // Обновляем общую сумму
                    setTotal(prevTotal => prevTotal + (newTotal - item.total));

                    return {
                        ...item,
                        count: newCount,
                        total: newTotal
                    };
                }
                return item;
            })
        );
    };

    const handleDelete = async (ids: string[]) => {
        setTotal(
            prevTotal =>
                prevTotal -
                ids.reduce((acc, id) => {
                    const product = products.find(p => p.productId === id);
                    return acc + (product?.total || 0);
                }, 0)
        );
        setProducts(prevProducts => prevProducts.filter(product => !ids.includes(product.productId)));
        clearSelection();
    };

    if (products.length === 0) {
        return (
            <>
                {" "}
                <EmptyTable text="Нет продуктов" textButton="Добавить" action={handleAdd} />{" "}
                {addWindow && !loading && (
                    <SelectedProductWindow
                        products={productsForTable}
                        onClose={() => setAddWindow(false)}
                        action={handleAddProduct}
                    />
                )}
            </>
        );
    }

    const columns: IColumnsProps<ProductItemWithProduct>[] = [
        { title: "Номер продукта", key: "productId" },
        { title: "Название продукта", key: "itemName" },
        { title: "Цена", key: "price" },
        {
            title: "Количество",
            key: "count",
            render: item => (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleChangeQuantity(item.productId, -1)}
                        disabled={item.count <= 1}
                        type="button"
                    >
                        <Minus size={14} />
                    </Button>
                    <span>{item.count}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleChangeQuantity(item.productId, 1)}
                        type="button"
                    >
                        <Plus size={14} />
                    </Button>
                </div>
            )
        },
        { title: "Сумма", key: "total" }
    ];

    return (
        <>
            <div className={cn(`pr-5 flex flex-col min-h-[calc(100vh-1000px)]`, className)}>
                <div className={`pr-5 flex flex-col min-h-[calc(100vh-1000px)]`}>
                    <div className="flex justify-between mb-3">
                        <Button onClick={handleAdd} type="button">
                            Добавить
                        </Button>
                        <div className="flex gap-2">
                            <Button className="bg-red-500" onClick={() => handleDelete(selected)} type="button">
                                Удалить
                            </Button>
                        </div>
                    </div>
                    {products.length > 0 && (
                        <>
                            <Table className="overflow-x-auto min-w-[1200px]">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead></TableHead>
                                        {columns.map(column => (
                                            <TableHead
                                                key={column.title}
                                                className="cursor-pointer"
                                                onClick={() => handleSort(column.key)}
                                            >
                                                <div
                                                    className={cn("flex items-center gap-2", {
                                                        "justify-end": column.key === "price" || column.key === "total",
                                                        "justify-center": column.key === "count"
                                                    })}
                                                >
                                                    {column.title}
                                                    {sortConfig.key === column.key &&
                                                        (sortConfig.direction === "asc" ? (
                                                            <ArrowUp size={14} />
                                                        ) : (
                                                            <ArrowDown size={14} />
                                                        ))}
                                                </div>
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentSortedItems.map(item => {
                                        return (
                                            <TableRow
                                                key={item.id}
                                                className="cursor-pointer"
                                                onDoubleClick={() => redirectToPage(item.productId)}
                                            >
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selected.includes(item.productId)}
                                                        onCheckedChange={() => handleSelect(item.productId)}
                                                    />
                                                </TableCell>
                                                {columns.map(column => (
                                                    <TableCell
                                                        key={String(column.key)}
                                                        className={cn({
                                                            "text-right":
                                                                column.key === "price" || column.key === "total",
                                                            "justify-center": column.key === "count"
                                                        })}
                                                    >
                                                        {column.render
                                                            ? column.render(item) // Используем render для колонки "Количество"
                                                            : formatTableCell<(typeof products)[0]>(item[column.key])}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                                {total && (
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={columns.length}>Итого:</TableCell>
                                            <TableCell className="text-right">
                                                {formatTableCell(total as never)} ₽
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                )}
                            </Table>
                            <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                        </>
                    )}
                </div>
            </div>
            {addWindow && !loading && (
                <SelectedProductWindow
                    products={productsForTable}
                    onClose={() => setAddWindow(false)}
                    action={handleAddProduct}
                />
            )}
        </>
    );
};
