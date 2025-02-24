"use client";

import { cn } from "@/lib";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";

export interface IPaginationProps {
    className?: string;
    currentPage: number;
    totalPages: number;
    paginate: (pageNumber: number) => void;
}

export const Pagination = ({ currentPage, totalPages, paginate, className }: IPaginationProps): React.JSX.Element => {
    const slideLeft = () => {
        paginate(currentPage > 1 ? currentPage - 1 : 1);
    };

    const slideRight = () => {
        paginate(currentPage < totalPages ? currentPage + 1 : totalPages);
    };

    return (
        <div className={cn("flex justify-between gap-4 mt-auto pt-4", className)}>
            <a onClick={slideLeft} className="cursor-pointer">
                <ArrowLeft
                    className={cn("w-6 h-6", {
                        "pointer-events-none text-gray-400": currentPage === 1
                    })}
                />
            </a>
            <div className="flex gap-4">
                {Array.from({ length: totalPages }, (_, i) => (
                    <a
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={cn(
                            "underline cursor-pointer",
                            currentPage === i + 1 ? "text-blue-500" : " text-gray-700"
                        )}
                    >
                        {i + 1}
                    </a>
                ))}
            </div>

            <a onClick={slideRight} className="cursor-pointer">
                <ArrowRight
                    className={cn("w-6 h-6", {
                        "pointer-events-none text-gray-400": currentPage == totalPages
                    })}
                />
            </a>
        </div>
    );
};
