import { cn } from "@/lib";
import { FormInput } from "../form-input";
import { Controller, useFormContext } from "react-hook-form";
import { onNumberValueChange } from "@/lib/inputs";

export interface IBannerPriceFormProps {
    className?: string;
    index: number;
}

export const BannerPriceForm = ({ index, className }: IBannerPriceFormProps): React.JSX.Element => {
    const {
        control,
        formState: { errors }
    } = useFormContext();

    return (
        <div className={cn("bg-secondary/60 flex flex-col gap-2 p-5", className)}>
            <h3 className="font-bold text-xl">{index}. Банеры</h3>
            <Controller
                control={control}
                name="bannerThreeHundred"
                render={({ field: { onChange, ...field } }) => (
                    <FormInput
                        {...field}
                        type="number"
                        label="Цена банера Б-300 за м²"
                        onChange={e => onNumberValueChange(e, onChange)}
                        errors={errors}
                        required
                        className="w-[400px]"
                    />
                )}
            />
            <Controller
                control={control}
                name="bannerFourHundred"
                render={({ field: { onChange, ...field } }) => (
                    <FormInput
                        {...field}
                        type="number"
                        label="Цена банера Б-400 за м²"
                        onChange={e => onNumberValueChange(e, onChange)}
                        errors={errors}
                        required
                        className="w-[400px]"
                    />
                )}
            />
            <Controller
                control={control}
                name="luvers"
                render={({ field }) => (
                    <FormInput
                        {...field}
                        type="number"
                        label="Цена люверса за штуку"
                        errors={errors}
                        required
                        className="w-[400px]"
                    />
                )}
            />
        </div>
    );
};
