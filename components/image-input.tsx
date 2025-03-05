"use client";

import { Input } from "./ui/input";
import React, { InputHTMLAttributes } from "react";
import { RequiredSymbol } from "./required-symbol";
import { ErrorText } from "./error-text";

export interface IImageInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
    name: string;
    label: string;
    required?: boolean;
    className?: string;
    errors?: any;
    value?: File | null;
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

    const errorText = errors?.[name];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
            if (onChange) {
                onChange(selectedFile);
            }
        } else {
            setPreview(undefined);
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

            <Input {...props} className="bg-white" type="file" accept="image/*" onChange={handleFileChange} />

            {previewUrl && (
                <div>
                    <img src={previewUrl} alt="Preview" style={{ maxWidth: "100%", height: "auto" }} />
                </div>
            )}
            {errorText && <ErrorText text={String(errorText.message)} className="mt-2" />}
        </div>
    );
};
