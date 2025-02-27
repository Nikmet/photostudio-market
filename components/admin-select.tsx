import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export interface IAdminSelectProps {
    className?: string;
    name: string;
    defaultValue?: string;
    placeholder: string;
    items: Record<string, string>;
}

export const AdminSelect = ({
    items,
    name,
    placeholder,
    defaultValue,
    className
}: IAdminSelectProps): React.JSX.Element => {
    return (
        <div className={className}>
            <Select name={name} defaultValue={defaultValue}>
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
        </div>
    );
};
