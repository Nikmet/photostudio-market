import { cn } from "@/lib";

export interface IContainerProps {
    children: React.ReactNode;
    className?: string;
}

export const Container = ({ children, className }: IContainerProps): React.JSX.Element => {
    return <div className={cn("mx-auto 2xl:w-[1400px] xl:w-[1200px] lg:w-[980px] md:w-[700px] sm:w-[600px] px-4", className)}>{children}</div>;
};
