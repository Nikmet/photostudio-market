import { IPage } from "@/@types/page";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PagesState {
    openPages: IPage[];
    activePage: IPage | null;
    addPage: (page: IPage) => void;
    removePage: (page: IPage) => void;
    clearPages: () => void;
    setActivePage: (page: IPage | null) => void;
}

export const usePagesStore = create<PagesState>()(
    persist(
        set => ({
            openPages: [],
            activePage: null,

            setActivePage: page => set({ activePage: page }),

            addPage: page =>
                set(state => ({
                    openPages: [...state.openPages, page]
                })),

            removePage: page =>
                set(state => ({
                    openPages: state.openPages.filter(p => p.name !== page.name)
                })),

            clearPages: () =>
                set(() => ({
                    openPages: []
                }))
        }),
        {
            name: "pages-storage",
            partialize: state => ({ openPages: state.openPages, activePage: state.activePage })
        }
    )
);
