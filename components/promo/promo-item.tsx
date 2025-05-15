import { cn } from "@/lib";
import { PromotionPage } from "@prisma/client";
import Link from "next/link";

export interface IPromoItemProps {
    className?: string;
    promoData: PromotionPage;
}

export const PromoItem = ({ promoData, className }: IPromoItemProps): React.JSX.Element => {
    return (
        <div className={cn(className, "border border-slate-400 rounded-md")}>
            <Link className="h-[250px] rounded-md" href={`/promo/${promoData.route}`}>
                <img
                    src={`${process.env.NEXT_PUBLIC_URL}/${promoData.image}`}
                    alt={promoData.alt}
                    className="w-full h-full object-cover"
                />
            </Link>
        </div>
    );
};
