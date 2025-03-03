export const onNumberValueChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    const value = e.target.value;
    onChange(value === "" ? "" : Number(value));
};
