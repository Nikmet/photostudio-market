import { cn } from "@/lib";
import { FormInput } from "../form-input";
import { Controller, useFormContext } from "react-hook-form";
import { onNumberValueChange } from "@/lib/inputs";

export interface IStandPriceFormProps {
    className?: string;
    index: number;
}

export const StandPriceForm = ({ index, className }: IStandPriceFormProps): React.JSX.Element => {
    const {
        control,
        formState: { errors }
    } = useFormContext();

    return (
        <div className={cn("bg-secondary/60 flex flex-col gap-2 p-5", className)}>
            <h3 className="font-bold text-xl">{index}. Стенды</h3>
            <Controller
                control={control}
                name="stand"
                render={({ field: { onChange, ...field } }) => (
                    <FormInput
                        {...field}
                        type="number"
                        label="Цена стенда за м²"
                        onChange={e => onNumberValueChange(e, onChange)}
                        errors={errors}
                        required
                        className="w-[400px]"
                    />
                )}
            />
            <Controller
                control={control}
                name="pocket"
                render={({ field: { onChange, ...field } }) => (
                    <FormInput
                        {...field}
                        type="number"
                        label="Цена кармана за штуку"
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
