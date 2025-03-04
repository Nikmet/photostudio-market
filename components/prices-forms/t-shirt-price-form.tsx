import { cn } from "@/lib";
import { FormInput } from "../form-input";
import { Controller, useFormContext } from "react-hook-form";

export interface ITShirtPriceFormProps {
    className?: string;
    index: number;
}

export const TShirtPriceForm = ({ index, className }: ITShirtPriceFormProps): React.JSX.Element => {
    const {
        control,
        formState: { errors }
    } = useFormContext();

    return (
        <div className={cn("bg-secondary/60 flex flex-col gap-2 p-5", className)}>
            <h3 className="font-bold text-xl">{index}. Футболки</h3>
            <Controller
                control={control}
                name="tShirtOneSidePrice"
                render={({ field }) => (
                    <FormInput
                        {...field}
                        type="number"
                        label="Цена футболки с односторонней печатью"
                        errors={errors}
                        required
                        className="w-[400px]"
                    />
                )}
            />
            <Controller
                control={control}
                name="tShirtTwoSidesPrice"
                render={({ field }) => (
                    <FormInput
                        {...field}
                        type="number"
                        label="Цена футболки с двусторонней печатью"
                        errors={errors}
                        required
                        className="w-[400px]"
                    />
                )}
            />
        </div>
    );
};
