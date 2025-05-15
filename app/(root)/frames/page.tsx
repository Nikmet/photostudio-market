import { CardsGenerator } from "@/components/cards-generator";

export default function FramesPage() {
    return (
        <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-10 text-blue-700">Фоторамки</h1>
            <CardsGenerator tag="Рамки" />
        </div>
    );
}
