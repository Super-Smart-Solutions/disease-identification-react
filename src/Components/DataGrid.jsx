import React, { useState } from "react";
import { FaArrowAltCircleDown } from "react-icons/fa";

export default function DataGrid({ rowData = [], colDefs = [], loading }) {
  const [sortConfig, setSortConfig] = useState(null);

  const sortedData = React.useMemo(() => {
    if (!sortConfig || !rowData) return rowData;
    return [...rowData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [rowData, sortConfig]);

  const requestSort = (key) => {
    const column = colDefs.find((col) => col.field === key);
    if (!column?.sortable) return; // Only sort if column is sortable

    let direction = "asc";
    if (sortConfig?.key === key && sortConfig?.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const formatValue = (col, value, row) => {
    if (col.valueFormatter) {
      return col.valueFormatter({ value, data: row });
    }
    return value;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">Loading...</div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-300 rounded-lg">
      <table className="min-w-full border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            {colDefs.map((col) => (
              <th key={col.field} className="px-4 py-2 text-left">
                <div className="flex items-center gap-1">
                  {col.headerName}
                  {col.sortable && ( // Only show sort icon if sortable is true
                    <button onClick={() => requestSort(col.field)}>
                      <FaArrowAltCircleDown className="w-4 h-4 cursor-pointer" />
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData?.length > 0 ? (
            sortedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border border-gray-300 odd:bg-gray-50"
              >
                {colDefs.map((col) => (
                  <td
                    key={col.field}
                    className={`border border-gray-300 px-4 py-2 ${
                      col.disabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {col.cellRenderer
                      ? col.cellRenderer({ value: row[col.field], data: row })
                      : formatValue(col, row[col.field], row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={colDefs.length} className="text-center py-4">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
