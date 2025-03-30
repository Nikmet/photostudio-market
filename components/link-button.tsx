"use client";

import { PictureInPicture2 } from "lucide-react";
import { Button } from "./ui";
import { usePagesStore } from "@/store/pages-store";
import { useRouter } from "next/navigation";

export interface ILinkButtonProps {
    className?: string;
    href?: string;
    name?: string;
    text?: string;
}

export const LinkButton = ({ href, name, text, className }: ILinkButtonProps): React.JSX.Element => {
    const { setActivePage, addPage, openPages } = usePagesStore();
    const router = useRouter();

    const handleClick = () => {
        if (href && name) {
            const page = {
                href,
                name
            };

            if (openPages.find(p => p.name === page.name)) {
                router.push(page.href);
                setActivePage(page);
                return;
            }

            router.push(page.href);
            setActivePage(page);
            addPage(page);
        }
    };

    return (
        <div className={className}>
            <Button variant={"outline"} type="button" onClick={handleClick} className="flex items-center gap-2">
                <PictureInPicture2 />
                {text && <span>{text}</span>}
            </Button>
        </div>
    );
};
