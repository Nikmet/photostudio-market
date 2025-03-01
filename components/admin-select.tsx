"use client";

import { IPage } from "@/@types/page";
import { LinkButton } from "./link-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import React from "react";
import { cn } from "@/lib";

export interface IAdminSelectProps {
    className?: string;
    name: string;
    defaultValue?: string;
    placeholder: string;
    items: Record<string, string>;
    route: string;
}

export const AdminSelect = ({
    items,
    name,
    placeholder,
    defaultValue,
    route,
    className
}: IAdminSelectProps): React.JSX.Element => {
    const [page, setPage] = React.useState<IPage>();

    const handleChange = (key: string) => {
        const page: IPage = {
            href: `/admin/${route}/${key}`,
            name: key
        };
        console.log(page);

        setPage(page);
    };

    return (
        <div className={cn("flex gap-2", className)}>
            <Select name={name} defaultValue={defaultValue} onValueChange={e => handleChange(e)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(items).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                            {value}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {page ? (
                <LinkButton href={page.href} name={page.name} />
            ) : (
                <LinkButton href={`/admin/${route}/${defaultValue}`} name={defaultValue} />
            )}
        </div>
    );
};
