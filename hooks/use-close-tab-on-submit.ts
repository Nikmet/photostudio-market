import { usePagesStore } from "@/store/pages-store";

export const UseCloseTabOnSubmit = () => {
    const { addPage, removePage, openPages } = usePagesStore();

    const closeTab = (id: string, href: string, name: string) => {
        if (!openPages.find(p => p.href === href)) {
            addPage({
                name,
                href
            });
        }
        removePage(openPages.find(p => p.name === id)!, href);
    };

    return { closeTab };
};
