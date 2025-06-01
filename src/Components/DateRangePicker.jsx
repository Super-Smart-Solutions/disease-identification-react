import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";

const DateRangePicker = ({ startDate, endDate, onDateChange }) => {
  return (
    <DatePicker
      selected={startDate}
      onChange={onDateChange}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      minDate={new Date(2000, 0, 1)}
      className="custom-input z-50"
      calendarClassName="bg-white shadow-lg rounded-lg"
    />
  );
};

export default DateRangePicker;
