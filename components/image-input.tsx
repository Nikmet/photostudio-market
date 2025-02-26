"use client";

import { cn } from "@/lib";
import { Input } from "./ui/input";
import React from "react";
import { ThemeImage } from "./theme-image";

export interface IImageInputProps {
    className?: string;
    name: string;
}

export const ImageInput = ({ name, className }: IImageInputProps): React.JSX.Element => {
    const [preview, setPreview] = React.useState<string>("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <ThemeImage
                darkSrc={preview ? preview : "/logo_dark.svg"}
                lightSrc={preview ? preview : "/logo_light.svg"}
                className="w-[500px] h-[500px]"
                alt="Preview"
            />
            <Input type="file" accept="image/*" onChange={handleImageChange} name={name} />
        </div>
    );
};
