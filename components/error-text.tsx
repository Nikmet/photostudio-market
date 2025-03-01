import { cn } from "@/lib";
import { JSX } from "react";

export interface IErrorTextProps {
    className?: string;
    text: string;
}

export const ErrorText = ({ text, className }: IErrorTextProps): JSX.Element => {
    return <p className={cn("text-red-500 text-sm", className)}>{text}</p>;
};
