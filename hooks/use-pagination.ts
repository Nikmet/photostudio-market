"use client";

import React from "react";

export const usePagination = <T>(data: T[], itemsPerPage: number) => {
    const [currentPage, setCurrentPage] = React.useState(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return { currentItems, currentPage, totalPages, paginate };
};
