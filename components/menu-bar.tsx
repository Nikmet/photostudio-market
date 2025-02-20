export interface IMenuBarProps {
    className?: string;
}

export const MenuBar = ({ className }: IMenuBarProps): React.JSX.Element => {
    return <div className={className}></div>;
};
