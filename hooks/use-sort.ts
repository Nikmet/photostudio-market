import { useState } from "react";

export const useSort = <T>(initialData: T[]) => {
    const [sortedData, setSortedData] = useState<T[]>(initialData);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof T | null;
        direction: "asc" | "desc" | null;
    }>({
        key: null,
        direction: null
    });

    const handleSort = (key: keyof T) => {
        let direction: "asc" | "desc" | null = "asc";

        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        } else if (sortConfig.key === key && sortConfig.direction === "desc") {
            direction = null;
        }

        setSortConfig({ key, direction });

        const sorted = [...sortedData].sort((a, b) => {
            if (direction === null) {
                return 0;
            }

            if (a[key] < b[key]) {
                return direction === "asc" ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === "asc" ? 1 : -1;
            }
            return 0;
        });

        setSortedData(direction === null ? initialData : sorted);
    };

    return {
        sortedData,
        sortConfig,
        handleSort,
        setSortedData
    };
};
