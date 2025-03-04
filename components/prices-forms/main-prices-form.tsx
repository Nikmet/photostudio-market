"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { pricesFormSchema, PricesFormValues } from "./prices-schema";
import { CupPriceForm } from "./cup-price-form";
import { TShirtPriceForm } from "./t-shirt-price-form";

export interface IMainPricesFormProps {
    className?: string;
    defaultValues: PricesFormValues;
    onSubmit: (data: PricesFormValues) => void;
}

export const MainPricesForm = ({ defaultValues, onSubmit, className }: IMainPricesFormProps): React.JSX.Element => {
    const form = useForm<PricesFormValues>({
        resolver: zodResolver(pricesFormSchema),
        defaultValues: defaultValues
    });

    return (
        <div className={className}>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-3 gap-5">
                        <CupPriceForm index={1} />
                        <TShirtPriceForm index={2} />
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};
