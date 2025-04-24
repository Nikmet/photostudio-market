import { cn } from "@/lib";

export interface IPageTitleProps {
    className?: string;
    children?: React.ReactNode;
}

export const PageTitle = ({ children, className }: IPageTitleProps): React.JSX.Element => {
    return <h1 className={cn("2xl:text-4xl text-2xl font-medium my-4 text-center 2xl:text-start", className)}>{children}</h1>;
};
