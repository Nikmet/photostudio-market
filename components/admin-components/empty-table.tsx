import { ShoppingBasket } from "lucide-react";
import { Button } from "../ui";
import { cn } from "@/lib";

export interface IEmptyTableProps {
    className?: string;
    text: string;
    textButton: string;
    action?: () => void;
}

export const EmptyTable = ({ text, action, textButton, className }: IEmptyTableProps): React.JSX.Element => {
    return (
        <div className={cn("flex flex-col gap-2 items-center border border-solid mt-3 p-4 rounded-md", className)}>
            <ShoppingBasket size={32} />
            <p>{text}</p>
            <Button type="button" onClick={action}>
                {textButton}
            </Button>
        </div>
    );
};
