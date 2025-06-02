import { useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import DropdownMenu from "./DropdownMenu";

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const pageNumbers = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageSizeSelect = (size) => {
    onPageSizeChange(size);
    onPageChange(1);
    setIsPageSizeMenuOpen(false);
  };

  const pageSizeOptions = [20, 50, 100].map((size) => ({
    label: `${t("show_key")} ${size}`,
    onClick: () => handlePageSizeSelect(size),
    isSelected: pageSize === size,
  }));

  const PreviousIcon = isRTL ? FaChevronRight : FaChevronLeft;
  const NextIcon = isRTL ? FaChevronLeft : FaChevronRight;

  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 w-full"
      dir={i18n.dir()}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          {t("showing_key", {
            from: (currentPage - 1) * pageSize + 1,
            to: Math.min(currentPage * pageSize, totalItems),
            total: totalItems,
          })}
        </span>

        {/* Replace select with DropdownMenu */}
        <DropdownMenu
          buttonContent={
            <span className="text-sm">
              {t("show_key")} {pageSize}
            </span>
          }
          options={pageSizeOptions}
        />
      </div>

      <nav className="flex items-center gap-1">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`p-2 rounded-md border cursor-pointer ${
            currentPage === 1
              ? "border-gray-200 text-gray-400 cursor-not-allowed"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
          aria-label={t("previous_page_key")}
        >
          <PreviousIcon className="h-4 w-4" />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={`w-10 h-10 rounded-md border text-sm cursor-pointer ${
                1 === currentPage
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              1
            </button>
            {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
          </>
        )}

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`w-10 h-10 rounded-md border text-sm cursor-pointer ${
              number === currentPage
                ? "border-primary bg-primary text-white"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {number}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 text-gray-500">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className={`w-10 h-10 rounded-md border text-sm cursor-pointer ${
                totalPages === currentPage
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md border cursor-pointer ${
            currentPage === totalPages
              ? "border-gray-200 text-gray-400 cursor-not-allowed"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
          aria-label={t("next_page_key")}
        >
          <NextIcon className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
