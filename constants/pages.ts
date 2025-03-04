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
                name: "Значки",
                href: "/admin/badges"
            },
            {
                name: "Кружки",
                href: "/admin/cups"
            },
            {
                name: "ЛГР",
                href: "/admin/lec"
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
                name: "Футболки",
                href: "/admin/t-shirts"
            }
        ]
    },
    {
        category: "Реклама",
        pages: [
            {
                name: "Адресные аншлаги",
                href: "/admin/address-plaques"
            },
            {
                name: "Банеры",
                href: "/admin/banners"
            },
            {
                name: "Визитки",
                href: "/admin/business-cards"
            },
            {
                name: "Информационные вывески",
                href: "/admin/newsletters"
            },
            {
                name: "Стенды",
                href: "/admin/stands"
            },
            {
                name: "Таблички",
                href: "/admin/tables"
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
                name: "ШФП",
                href: "/admin/lfps"
            },
            {
                name: "Цвета",
                href: "/admin/colors"
            }
        ]
    },
    {
        category: "Рамки",
        pages: [
            {
                name: "Багет",
                href: "/admin/baguettes"
            },
            {
                name: "Рамки",
                href: "/admin/frames"
            }
        ]
    }
];
