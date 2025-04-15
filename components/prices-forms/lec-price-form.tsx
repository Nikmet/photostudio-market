import { cn } from "@/lib";
import { Controller, useFormContext } from "react-hook-form";
import { onNumberValueChange } from "@/lib/inputs";
import { FormInput } from "../inputs/form-input";

export interface ILecPriceFormProps {
    className?: string;
    index: number;
}

export const LecPriceForm = ({ index, className }: ILecPriceFormProps): React.JSX.Element => {
    const {
        control,
        formState: { errors }
    } = useFormContext();

    return (
        <div className={cn("bg-secondary/60 flex flex-col gap-2 p-5", className)}>
            <h3 className="font-bold text-xl">{index}. ЛГР</h3>
            <Controller
                control={control}
                name="lecPrice"
                render={({ field: { onChange, ...field } }) => (
                    <FormInput
                        {...field}
                        type="number"
                        label="Цена ЛГР за м²"
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
