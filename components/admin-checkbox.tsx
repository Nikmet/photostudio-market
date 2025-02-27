import { Checkbox } from "./ui/checkbox";

export interface IAdminCheckboxProps {
    className?: string;
    label: string;
    name: string;
    defaultChecked?: boolean;
}

export const AdminCheckbox = ({ label, name, defaultChecked, className }: IAdminCheckboxProps): React.JSX.Element => {
    return (
        <div className={className}>
            <Checkbox id={name + label} name={name} defaultChecked={defaultChecked} />
            <label
                htmlFor={name + label}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {label}
            </label>
        </div>
    );
};
