import React, { useState } from "react";
import { FaArrowAltCircleDown } from "react-icons/fa";

export default function DataGrid({ rowData, colDefs }) {
  const [sortConfig, setSortConfig] = useState(null);

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return rowData;
    const sorted = [...rowData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [rowData, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="overflow-x-auto border border-gray-300 rounded-lg ">
      <table className="min-w-full border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            {colDefs.map((col) => (
              <th key={col.field} className=" px-4 py-2 text-left">
                <div className={`flex items-center gap-1 `}>
                  {col.headerName}
                  {col.sortable && (
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
          {sortedData.map((row, rowIndex) => (
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
                    ? col.cellRenderer(row[col.field], row)
                    : row[col.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
