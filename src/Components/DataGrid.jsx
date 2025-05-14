import React, { useState, useMemo, useCallback, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import { useTranslation } from "react-i18next";
import { FiSearch } from "react-icons/fi";
import noDataImg from "../assets/no-data.png";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

import Pagination from "./Pagination";
import TableSkeleton from "./skeltons/TableSkeleton";

export default function DataGrid({
  rowData = [],
  colDefs = [],
  loading,
  pagination = false,
  currentPage = 1,
  pageSize = 10,
  totalItems = 0,
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
  title = "",
  onSearch,
  onAdd,
  searchPlaceholder = "Search...",
}) {
  const { t, i18n } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");

  // Constants for height calculation
  const ROW_HEIGHT = 50;
  const HEADER_HEIGHT = 50;
  const MAX_VISIBLE_ROWS = 10;

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchValue);
    }
  }, [debouncedSearchValue, onSearch]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    }),
    []
  );

  const processedColDefs = useMemo(() => {
    return colDefs.map((col) => ({
      ...col,
      headerName: col.headerName || col.field,
      sortable: col.sortable !== false,
    }));
  }, [colDefs]);

  const gridOptions = {
    animateRows: true,
    suppressCellFocus: true,
    headerHeight: HEADER_HEIGHT,
    rowHeight: ROW_HEIGHT,
  };

  const valueFormatter = useCallback((params) => {
    const colDef = params.colDef;
    if (colDef.valueFormatter) {
      return colDef.valueFormatter({
        value: params.value,
        data: params.data,
      });
    }
    return params.value;
  }, []);

  return (
    <div className="space-y-4">
      {/* Header with title and search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex justify-between items-center w-full">
          {title && (
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          )}
          {onAdd && onAdd}
        </div>

        {onSearch && (
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={loading ? "" : searchPlaceholder}
              disabled={loading}
              className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </div>
        )}
      </div>

      {/* Grid Container */}
      <div
        className="ag-theme-alpine relative"
        style={{
          width: "100%",
          height: `550px`,
        }}
      >
        {loading ? (
          <TableSkeleton
            columns={colDefs.length}
            rows={Math.min(totalItems || MAX_VISIBLE_ROWS, MAX_VISIBLE_ROWS)}
          />
        ) : rowData?.length > 0 ? (
          <AgGridReact
            enableRtl={i18n.language === "ar"}
            rowData={rowData}
            columnDefs={processedColDefs}
            defaultColDef={defaultColDef}
            gridOptions={gridOptions}
            valueFormatter={valueFormatter}
            suppressNoRowsOverlay={true}
            domLayout={
              rowData.length > MAX_VISIBLE_ROWS ? "normal" : "autoHeight"
            }
            modules={[ClientSideRowModelModule]}
            onGridReady={(params) => {
              params.api.sizeColumnsToFit();
            }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <img
              src={noDataImg}
              alt="No data"
              className="max-h-60 object-contain opacity-75"
            />
            <p className="text-gray-500 text-lg relative bottom-12">
              {t("no_data_available_key")}
            </p>
          </div>
        )}
      </div>

      {/* Pagination - show when there are more than 10 items */}
      {pagination && totalItems > 10 && (
        <div className={loading ? "opacity-50" : ""}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
}
