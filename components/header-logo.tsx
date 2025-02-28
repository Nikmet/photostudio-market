"use client";

import Link from "next/link";
import { ThemeImage } from "./theme-image";
import { usePagesStore } from "@/store/pages-store";

export interface IHeaderLogoProps {
    className?: string;
    admin?: boolean;
}

export const HeaderLogo = ({ admin, className }: IHeaderLogoProps): React.JSX.Element => {
    const { setActivePage } = usePagesStore();

    return (
        <div className={className}>
            <Link href={admin ? "/admin" : "/"} onClick={admin ? () => setActivePage(null) : undefined}>
                <ThemeImage
                    darkSrc="/logo_dark.svg"
                    lightSrc="/logo_light.svg"
                    alt="Фотостудия-Маркет"
                    className="md:h-5 h-4"
                />
            </Link>
        </div>
    );
};
