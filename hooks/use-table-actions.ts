import { useRouter } from "next/navigation";
import { usePagesStore } from "@/store/pages-store";
import { IPage } from "@/@types/page";
import { createUid, getId } from "@/lib/uid";

export const useTableActions = <T extends { id: string }>(data: T[], route: string, prefix?: string) => {
    const router = useRouter();
    const { addPage, setActivePage, openPages } = usePagesStore();

    const redirectToPage = (id: string) => {
        const page: IPage = {
            href: `/admin/${route}/${id}`,
            name: id
        };

        if (openPages.find(p => p.name === page.name)) {
            router.push(page.href);
            setActivePage(page);
            return;
        }

        router.push(page.href);
        addPage(page);
        setActivePage(page);
    };

    const handleAdd = () => {
        if (data.length === 0) {
            const uid = createUid(prefix ?? "", "1"); // Начинаем с 1, если массив пуст
            redirectToPage(uid);
            return;
        }

        const maxId = Math.max(...data.map(item => Number(getId(item.id))));
        const newId = (maxId + 1).toString();
        const uid = createUid(prefix ?? "", newId);
        redirectToPage(uid);
    };

    return {
        handleAdd,
        redirectToPage
    };
};
