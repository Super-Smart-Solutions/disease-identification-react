import React, { useState } from "react";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Pagination from "./Pagination";
import { TableSkeleton } from "./TableSkeleton";

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
}) {
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
    if (!column?.sortable) return;
    let direction = "asc";
    if (sortConfig?.key === key && sortConfig?.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const formatValue = (col, value, row) => {
    if (col.valueFormatter) return col.valueFormatter({ value, data: row });
    return value;
  };

  if (loading) {
    return <TableSkeleton columns={colDefs.length} rows={pageSize} />;
  }

  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <motion.table
          className="min-w-full border-gray-300"
          initial="hidden"
          animate="visible"
          variants={tableVariants}
        >
          <thead className="bg-gray-100">
            <tr>
              {colDefs.map((col) => (
                <th key={col.field} className="px-4 py-2 text-left">
                  <motion.div className="flex items-center gap-1">
                    {col.headerName}
                    {col.sortable && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => requestSort(col.field)}
                      >
                        <FaArrowAltCircleDown className="w-4 h-4 cursor-pointer" />
                      </motion.button>
                    )}
                  </motion.div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {sortedData?.length > 0 ? (
                sortedData.map((row, rowIndex) => (
                  <motion.tr
                    key={rowIndex}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="border border-gray-300 odd:bg-gray-50"
                    layout // This enables layout animations
                  >
                    {colDefs.map((col) => (
                      <td
                        key={col.field}
                        className={`border border-gray-300 px-4 py-2 ${
                          col.disabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {col.cellRenderer ? (
                          col.cellRenderer({ value: row[col.field], data: row })
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {formatValue(col, row[col.field], row)}
                          </motion.div>
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td colSpan={colDefs.length} className="text-center py-4">
                    No data available
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </motion.table>
      </div>

      {pagination && totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}
