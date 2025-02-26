import { IPage } from "@/@types/page";

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

export const adminPages: IPage[] = [
    {
        name: "Рамки",
        href: "/admin/frames"
    },
    {
        name: "Кружки",
        href: "/admin/cups"
    },
    {
        name: "Значки",
        href: "/admin/badges"
    },
    {
        name: "Цвета",
        href: "/admin/colors"
    },
    {
        name: "Визитки",
        href: "/admin/business-cards"
    }
];
