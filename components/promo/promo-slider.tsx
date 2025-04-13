"use client";

import { PromotionPage } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./promo-slider.css"; // Дополнительные кастомные стили
import { PromoItem } from "./promo-item";

export interface IPromoSliderProps {
    className?: string;
    autoplayDelay?: number; // Задержка автопрокрутки в ms
    showNavigation?: boolean; // Показывать кнопки навигации
    showPagination?: boolean; // Показывать пагинацию
}

export const PromoSlider = ({
    className = "",
    autoplayDelay = 5000,
    showNavigation = true,
    showPagination = true
}: IPromoSliderProps): React.JSX.Element => {
    const [pages, setPages] = useState<PromotionPage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPages = async () => {
            try {
                setIsLoading(true);
                const res = await fetch("/api/promo/get-promo-pages");

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                setPages(data);
            } catch (err) {
                console.error("Failed to fetch promo pages:", err);
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPages();
    }, []); // Убрал pages из зависимостей, чтобы избежать бесконечного цикла

    if (isLoading) {
        return (
            <div className={`${className} flex justify-center items-center`}>
                <div className="loader"></div>
            </div>
        );
    }

    if (error) {
        return <div className={`${className} text-red-500`}>Error: {error}</div>;
    }

    if (pages.length === 0) {
        return <div className={`${className} text-gray-500`}>No promo pages available</div>;
    }

    return (
        <div className={`${className} relative`}>
            <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                loop={true}
                autoplay={{
                    delay: autoplayDelay,
                    disableOnInteraction: false
                }}
                navigation={false}
                pagination={showPagination ? { clickable: true } : false}
                className="h-full w-full"
            >
                {pages.map(page => (
                    <SwiperSlide key={page.id}>
                        <PromoItem promoData={page} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};
