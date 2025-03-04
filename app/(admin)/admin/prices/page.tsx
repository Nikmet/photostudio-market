import { MainPricesForm } from "@/components/prices-forms/main-prices-form";
import { PricesFormValues } from "@/components/prices-forms/prices-schema";
import { getDefaultPrices, updatePrices } from "@/lib/update-prices";

export default async function AdminPricesPage() {
    const onSubmit = async (data: PricesFormValues) => {
        "use server";
        updatePrices(data);
    };

    return (
        <div>
            <h1>Prices</h1>
            <MainPricesForm defaultValues={await getDefaultPrices()} onSubmit={onSubmit} />
        </div>
    );
}
