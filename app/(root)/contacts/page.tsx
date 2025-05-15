"use client";

import { useEffect } from "react";

export default function ContactsPage() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
        script.type = "text/javascript";
        script.onload = () => {
            // @ts-ignore
            window.ymaps.ready(() => {
                // @ts-ignore
                new window.ymaps.Map("map", {
                    center: [55.336104, 41.626241], // Координаты Москвы (замени на свои)
                    zoom: 16,
                    controls: ["zoomControl", "fullscreenControl"]
                }).geoObjects.add(
                    // @ts-ignore
                    new window.ymaps.Placemark([55.336104, 41.626241], {
                        balloonContent: "Офис Фотостудии-М"
                    })
                );
            });
        };
        document.body.appendChild(script);
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold text-center">Контакты</h1>

            <div className="space-y-4 text-lg">
                <p>
                    <strong>Адрес:</strong> г. Меленки, ул. Коммунистическая, д. 13
                </p>
                <p>
                    <strong>Телефон:</strong> +7 (905) 610-78-46
                </p>
                <p>
                    <strong>Email:</strong> photo-m@mail.ru
                </p>
                <p>
                    <strong>Время работы:</strong> Пн–Пт, 8:30–17:00
                </p>
            </div>

            <div id="map" className="w-full h-[400px] rounded-md shadow-md border" />
        </div>
    );
}
