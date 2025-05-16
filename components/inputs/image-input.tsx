"use client";

import React, { InputHTMLAttributes } from "react";
import { RequiredSymbol } from "./required-symbol";
import { ErrorText } from "./error-text";
import { Input } from "../ui/input";
import { Download } from "lucide-react";

export interface IImageInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
    name: string;
    label: string;
    required?: boolean;
    className?: string;
    errors?: any;
    value?: File | Blob | null;
    onChange?: (file: File | null) => void;
}

export const ImageInput = ({
    label,
    name,
    errors,
    required,
    className,
    value,
    onChange,
    ...props
}: IImageInputProps): React.JSX.Element => {
    const [preview, setPreview] = React.useState<string | undefined>();
    const [, setDownloadUrl] = React.useState<string | undefined>();

    const errorText = errors?.[name];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setPreview(result);
                setDownloadUrl(result);
            };
            reader.readAsDataURL(selectedFile);
            if (onChange) {
                onChange(selectedFile);
            }
        } else {
            setPreview(undefined);
            setDownloadUrl(undefined);
            if (onChange) {
                onChange(null);
            }
        }
    };

    const previewUrl = preview || (value ? URL.createObjectURL(value) : undefined);

    return (
        <div className={className}>
            {label && (
                <div className="font-medium mb-2">
                    {label} {required && <RequiredSymbol />}
                </div>
            )}

            <div className="relative w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] border border-gray-300 rounded-md mb-4">
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <p className="text-gray-500">Изображение отсутствует</p>
                    </div>
                )}
                {previewUrl && (
                    <a
                        href={previewUrl}
                        download="preview-image.png"
                        className="absolute top-2 right-2 bg-white dark:bg-blue-950 text-sm px-1 py-1 rounded-md shadow hover:bg-gray-100 transition"
                    >
                        <Download />
                    </a>
                )}
            </div>

            <Input
                {...props}
                className="bg-white dark:bg-gray-700 cursor-pointer w-[300px] lg:w-full"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />

            {errorText && <ErrorText text={String(errorText.message)} className="mt-2" />}
        </div>
    );
};
