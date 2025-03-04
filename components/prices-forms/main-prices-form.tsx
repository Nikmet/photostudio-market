"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { pricesFormSchema, PricesFormValues } from "./prices-schema";
import { CupPriceForm } from "./cup-price-form";
import { TShirtPriceForm } from "./t-shirt-price-form";
import { LecPriceForm } from "./lec-price-form";
import { BadgePriceForm } from "./badge-price-form";
import { MagnetPriceForm } from "./magnet-price-form";
import { PrintingPriceForm } from "./printing-price-form";
import { BannerPriceForm } from "./banner-price-form";
import { StandPriceForm } from "./stand-price-form";
import { BusinessCardPriceForm } from "./business-card-price-form";
import { FramePriceForm } from "./frame-price-form";
import { Button } from "../ui";
import toast from "react-hot-toast";

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

    const submitAction = async (data: PricesFormValues) => {
        onSubmit(data);
        toast.success("Цены успешно сохранены!");
    };

    return (
        <div className={className}>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(submitAction)} className="overflow-auto scrollbar h-[75vh]">
                    <div className="grid grid-cols-3 gap-5">
                        <CupPriceForm index={1} />
                        <LecPriceForm index={2} />
                        <BadgePriceForm index={3} />
                        <TShirtPriceForm index={4} />
                        <MagnetPriceForm index={5} />
                        <PrintingPriceForm index={6} />
                        <BannerPriceForm index={7} />
                        <FramePriceForm index={8} />
                        <StandPriceForm index={9} />
                        <BusinessCardPriceForm index={10} />
                    </div>
                    <div className="flex items-center justify-end gap-2 p-4">
                        <Button className="bg-red-500">Очистить все значения</Button>
                        <Button className="bg-blue-500" type="submit">
                            Сохранить
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};
