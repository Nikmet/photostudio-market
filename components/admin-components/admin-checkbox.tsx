import { cn } from "@/lib";
import { Checkbox } from "../ui/checkbox";

export interface IAdminCheckboxProps {
    className?: string;
    label: string | React.ReactNode;
    name: string;
    defaultChecked?: boolean;
    checked?: boolean;
    onChange?: (checked: boolean) => void; // Уточняем тип onChange
}

export const AdminCheckbox = ({
    label,
    name,
    defaultChecked,
    checked,
    className,
    onChange,
    ...props
}: IAdminCheckboxProps): React.JSX.Element => {
    return (
        <div className={cn("flex gap-2", className)}>
            <Checkbox
                id={name + label}
                name={name}
                defaultChecked={defaultChecked}
                checked={checked} // Передаем checked
                onCheckedChange={onChange} // Используем onCheckedChange для обработки изменений
                {...props}
            />
            <label
                htmlFor={name + label}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {label}
            </label>
        </div>
    );
};
