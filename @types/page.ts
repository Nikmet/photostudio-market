export interface IPage {
    name: string;
    href: string;
}

export interface IAdminPage {
    category: string;
    pages: IPage[];
}
