import { cn } from "@/lib";
import { Controller, useFormContext } from "react-hook-form";
import { onNumberValueChange } from "@/lib/inputs";
import { FormInput } from "../inputs/form-input";

export interface IBadgePriceFormProps {
    className?: string;
    index: number;
}

export const BadgePriceForm = ({ index, className }: IBadgePriceFormProps): React.JSX.Element => {
    const {
        control,
        formState: { errors }
    } = useFormContext();

    return (
        <div className={cn("bg-secondary/60 flex flex-col gap-2 p-5", className)}>
            <h3 className="font-bold text-xl">{index}. Значки</h3>
            <Controller
                control={control}
                name="badgePrice"
                render={({ field: { onChange, ...field } }) => (
                    <FormInput
                        {...field}
                        type="number"
                        label="Цена значков за 50 штук"
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
