import { cn } from "@/lib";
import { FormInput } from "../form-input";
import { Controller, useFormContext } from "react-hook-form";
import { onNumberValueChange } from "@/lib/inputs";

export interface IPrintingPriceFormProps {
    className?: string;
    index: number;
}

export const PrintingPriceForm = ({ index, className }: IPrintingPriceFormProps): React.JSX.Element => {
    const {
        control,
        formState: { errors }
    } = useFormContext();

    return (
        <div className={cn("bg-secondary/60 flex flex-col gap-2 p-5", className)}>
            <h3 className="font-bold text-xl">{index}. Печати</h3>
            <Controller
                control={control}
                name="printingWithTooling"
                render={({ field: { onChange, ...field } }) => (
                    <FormInput
                        {...field}
                        type="number"
                        label="Цена печати с оснасткой"
                        onChange={e => onNumberValueChange(e, onChange)}
                        errors={errors}
                        required
                        className="w-[400px]"
                    />
                )}
            />
            <Controller
                control={control}
                name="printingWithoutTooling"
                render={({ field: { onChange, ...field } }) => (
                    <FormInput
                        {...field}
                        type="number"
                        label="Цена печати без оснастки"
                        onChange={e => onNumberValueChange(e, onChange)}
                        errors={errors}
                        required
                        className="w-[400px]"
                    />
                )}
            />
        </div>
    );
};
