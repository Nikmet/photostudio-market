import { cn } from "@/lib";

export interface IPageTitleProps {
    className?: string;
    children?: React.ReactNode;
}

export const PageTitle = ({ children, className }: IPageTitleProps): React.JSX.Element => {
    return <h1 className={cn("text-4xl font-medium my-4", className)}>{children}</h1>;
};
