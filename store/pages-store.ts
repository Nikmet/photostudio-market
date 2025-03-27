import { IPage } from "@/@types/page";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";

interface PagesState {
    openPages: IPage[];
    activePage: IPage | null;
    addPage: (page: IPage) => void;
    removePage: (page: IPage, href?: string) => void;
    clearPages: () => void;
    setActivePage: (page: IPage | null) => void;
}

export const usePagesStore = create<PagesState>()(
    devtools(
        persist(
            (set, get) => ({
                openPages: [],
                activePage: null,

                setActivePage: page => set({ activePage: page }),

                addPage: page =>
                    set(state => ({
                        openPages: [...state.openPages, page]
                    })),

                removePage: (page, href) => {
                    set(state => {
                        const currentState = get();
                        if (currentState.activePage?.name === page.name) {
                            const filteredPages = state.openPages.filter(p => p.name !== page.name);
                            return {
                                openPages: filteredPages,
                                activePage: filteredPages.find(p => p.href === href) || null
                            };
                        }
                        return {
                            openPages: state.openPages.filter(p => p.name !== page.name)
                        };
                    });
                },

                clearPages: () =>
                    set(() => ({
                        openPages: [],
                        activePage: null
                    }))
            }),
            {
                name: "pages-storage",
                partialize: state => ({ openPages: state.openPages, activePage: state.activePage })
            }
        )
    )
);
