import { CardsGenerator } from "@/components/cards-generator";
import { PageTitle } from "@/components/page-title";

export default function AdvertisingPage() {
    return (
        <div>
            <PageTitle>Реклама</PageTitle>
            <CardsGenerator tag="Реклама" />
        </div>
    );
}
