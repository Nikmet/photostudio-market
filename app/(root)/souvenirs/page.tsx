import { CardsGenerator } from "@/components/cards-generator";
import { PageTitle } from "@/components/page-title";

export default function SouvenirsPage() {
    return (
        <div>
            <PageTitle>Сувениры</PageTitle>
            <CardsGenerator tag="Сувениры" />
        </div>
    );
}
