export interface IColumnsProps<T> {
    title: string;
    key: keyof T;
    render?: (item: T) => React.ReactNode;
}
