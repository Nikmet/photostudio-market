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
    }
];
