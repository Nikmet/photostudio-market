import { InputHTMLAttributes } from "react";
import { RequiredSymbol } from "./required-symbol";
import { ErrorText } from "./error-text";
import { Input } from "../ui/input";

export interface IFormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label: string;
    required?: boolean;
    className?: string;
    errors?: any;
}

export const FormInput = ({
    name,
    label,
    required,
    errors,
    className,
    ...props
}: IFormInputProps): React.JSX.Element => {
    const errorText = errors[name];

    return (
        <div className={className}>
            {label && (
                <div className="font-medium mb-2">
                    {label} {required && <RequiredSymbol />}
                </div>
            )}

            <Input {...props} className="bg-white" />

            {errorText && <ErrorText text={String(errorText.message)} className="mt-2" />}
        </div>
    );
};
