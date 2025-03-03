"use client";

import { PictureInPicture2 } from "lucide-react";
import { Button } from "./ui";
import { usePagesStore } from "@/store/pages-store";
import { useRouter } from "next/navigation";

export interface ILinkButtonProps {
    className?: string;
    href?: string;
    name?: string;
}

export const LinkButton = ({ href, name, className }: ILinkButtonProps): React.JSX.Element => {
    const { setActivePage, addPage } = usePagesStore();
    const router = useRouter();

    const handleClick = () => {
        if (href && name) {
            const page = {
                href,
                name
            };

            router.push(page.href);
            setActivePage(page);
            addPage(page);
        }
    };

    return (
        <div className={className}>
            <Button variant={"outline"} type="button" onClick={handleClick}>
                <PictureInPicture2 />
            </Button>
        </div>
    );
};
