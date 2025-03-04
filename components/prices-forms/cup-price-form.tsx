import { cn } from "@/lib";
import { FormInput } from "../form-input";
import { Controller, useFormContext } from "react-hook-form";

export interface ICupPriceFormProps {
    className?: string;
    index: number;
}

export const CupPriceForm = ({ index, className }: ICupPriceFormProps): React.JSX.Element => {
    const {
        control,
        formState: { errors }
    } = useFormContext();

    return (
        <div className={cn("bg-secondary/60 flex flex-col gap-2 p-5", className)}>
            <h3 className="font-bold text-xl">{index}. Кружки</h3>
            <Controller
                control={control}
                name="cupPrice"
                render={({ field }) => (
                    <FormInput
                        {...field}
                        type="number"
                        label="Цена кружки за штуку"
                        errors={errors}
                        required
                        className="w-[400px]"
                    />
                )}
            />
        </div>
    );
};
