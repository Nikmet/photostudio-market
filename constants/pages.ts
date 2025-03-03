import { IAdminPage, IPage } from "@/@types/page";

export const clientPages: IPage[] = [
    {
        name: "Сувениры",
        href: "/souvenirs"
    },
    {
        name: "Реклама",
        href: "/advertising"
    },
    {
        name: "Фоторамки",
        href: "/frames"
    }
];

export const adminPages: IAdminPage[] = [
    {
        category: "Сувениры",
        pages: [
            {
                name: "Кружки",
                href: "/admin/cups"
            },
            {
                name: "Значки",
                href: "/admin/badges"
            },
            {
                name: "Футболки",
                href: "/admin/t-shirts"
            },
            {
                name: "Магниты",
                href: "/admin/magnets"
            },
            {
                name: "Печати",
                href: "/admin/printings"
            },
            {
                name: "ЛГР",
                href: "/admin/lec"
            }
        ]
    },
    {
        category: "Реклама",
        pages: [
            {
                name: "Визитки",
                href: "/admin/business-cards"
            },
            {
                name: "Таблички",
                href: "/admin/tables"
            },
            {
                name: "Информационные таблички",
                href: "/admin/newsletters"
            },
            {
                name: "ШФП",
                href: "/admin/lfps"
            },
            {
                name: "Стенды",
                href: "/admin/stands"
            },
            {
                name: "Цвета",
                href: "/admin/colors"
            },
            {
                name: "Типы бумаги",
                href: "/admin/paper-types"
            },
            {
                name: "Формы адресных аншлагов",
                href: "/admin/address-plaque-form"
            },
            {
                name: "Адресные аншлаги",
                href: "/admin/address-plaques"
            },
            {
                name: "Банеры",
                href: "/admin/banners"
            }
        ]
    },
    {
        category: "Рамки",
        pages: [
            {
                name: "Рамки",
                href: "/admin/frames"
            },
            {
                name: "Багет",
                href: "/admin/baguettes"
            }
        ]
    }
];
