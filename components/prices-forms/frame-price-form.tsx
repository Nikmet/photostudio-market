import { cn } from "@/lib";
import { FormInput } from "../form-input";
import { Controller, useFormContext } from "react-hook-form";
import { onNumberValueChange } from "@/lib/inputs";

export interface IFramePriceFormProps {
    className?: string;
    index: number;
}

export const FramePriceForm = ({ index, className }: IFramePriceFormProps): React.JSX.Element => {
    const {
        control,
        formState: { errors }
    } = useFormContext();

    return (
        <div className={cn("bg-secondary/60 flex flex-col gap-2 p-5", className)}>
            <h3 className="font-bold text-xl">{index}. Рамки</h3>
            <Controller
                control={control}
                name="backdrop"
                render={({ field: { onChange, ...field } }) => (
                    <FormInput
                        {...field}
                        type="number"
                        label="Цена задника за м²"
                        onChange={e => onNumberValueChange(e, onChange)}
                        errors={errors}
                        required
                        className="w-[400px]"
                    />
                )}
            />
            <Controller
                control={control}
                name="suspension"
                render={({ field: { onChange, ...field } }) => (
                    <FormInput
                        {...field}
                        type="number"
                        label="Цена подвеса за штуку"
                        onChange={e => onNumberValueChange(e, onChange)}
                        errors={errors}
                        required
                        className="w-[400px]"
                    />
                )}
            />
            <Controller
                control={control}
                name="glass"
                render={({ field: { onChange, ...field } }) => (
                    <FormInput
                        {...field}
                        type="number"
                        label="Цена стекла за м²"
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
