import { InputHTMLAttributes } from "react";
import { RequiredSymbol } from "./required-symbol";
import { ErrorText } from "./error-text";
import { Textarea } from "../ui/textarea";

export interface IFormInputProps extends InputHTMLAttributes<HTMLTextAreaElement> {
    name: string;
    label: string;
    required?: boolean;
    className?: string;
    errors?: any;
    rows?: number;
}

export const FormTextarea = ({
    name,
    label,
    required,
    errors,
    rows,
    className,
    ...props
}: IFormInputProps): React.JSX.Element => {
    const errorText = errors[name];

    return (
        <div className={className}>
            {label && (
                <div className="font-medium mb-2 dark:text-gray-300">
                    {label} {required && <RequiredSymbol />}
                </div>
            )}

            <Textarea
                {...props}
                className="resize-none bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                rows={rows ?? 4}
            />

            {errorText && <ErrorText text={String(errorText.message)} className="mt-2" />}
        </div>
    );
};
