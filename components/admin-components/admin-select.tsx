"use client";

import { IPage } from "@/@types/page";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import React from "react";
import { cn } from "@/lib";
import { RequiredSymbol } from "../inputs/required-symbol";
import { LinkButton } from "../inputs/link-button";
import { ErrorText } from "../inputs/error-text";

export interface IAdminSelectProps {
    className?: string;
    name: string;
    value?: string;
    onChange?: (value: string) => void;
    defaultValue?: string;
    label: string;
    items: Record<string, string>;
    route?: string;
    required?: boolean;
    errors?: any;
}

export const AdminSelect = ({
    items,
    name,
    label,
    defaultValue,
    route,
    required,
    className,
    errors,
    value,
    onChange
}: IAdminSelectProps): React.JSX.Element => {
    const [page, setPage] = React.useState<IPage>();

    const errorText = errors[name];

    const handleChange = (key: string) => {
        const page: IPage = {
            href: `/admin/${route}/${key}`,
            name: key
        };

        setPage(page);
        onChange?.(key);
    };

    return (
        <div className={cn("flex flex-col", className)}>
            {label && (
                <div className="font-medium mb-2">
                    {label} {required && <RequiredSymbol />}
                </div>
            )}
            <div className="flex gap-2">
                <Select name={name} defaultValue={defaultValue} value={value} onValueChange={e => handleChange(e)}>
                    <SelectTrigger>
                        <SelectValue placeholder={label} />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(items).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                                {value}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {route && (
                    <>
                        {page ? (
                            <LinkButton href={page.href} name={page.name} />
                        ) : (
                            <LinkButton href={`/admin/${route}/${defaultValue}`} name={defaultValue} />
                        )}
                    </>
                )}
            </div>
            {errorText && <ErrorText text={String(errorText.message)} className="mt-2" />}
        </div>
    );
};
