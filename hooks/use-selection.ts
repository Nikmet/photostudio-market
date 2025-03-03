import { useState } from "react";

export const useSelection = () => {
    const [selected, setSelected] = useState<string[]>([]);

    const handleSelect = (id: string) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(item => item !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const clearSelection = () => {
        setSelected([]);
    };

    return {
        selected,
        handleSelect,
        clearSelection
    };
};
