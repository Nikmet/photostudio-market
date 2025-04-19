"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export const SuccessAnimation = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className="h-full bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center border border-blue-100">
                {/* SVG иконка с анимацией */}
                <div className="mx-auto mb-6 w-24 h-24">
                    <svg viewBox="0 0 100 100" className="text-blue-500">
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#1d4ed8" />
                            </linearGradient>
                        </defs>
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            style={{
                                strokeDasharray: 283,
                                strokeDashoffset: isMounted ? 0 : 283,
                                transition: "stroke-dashoffset 1s ease-out"
                            }}
                        />
                        <path
                            d="M30,50 L45,65 L70,35"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                strokeDasharray: 100,
                                strokeDashoffset: isMounted ? 0 : 100,
                                transition: "stroke-dashoffset 0.8s ease-out 0.5s"
                            }}
                        />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-blue-800 mb-3">Покупка совершена!</h1>

                <p className="text-blue-600 mb-6">Спасибо за ваш заказ! Мы рады, что вы выбрали нас.</p>

                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    Вернуться в магазин
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </Link>
            </div>
        </div>
    );
};
