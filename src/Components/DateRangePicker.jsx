import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateRangePicker = ({ startDate, endDate, onDateChange }) => {
  const [tempDates, setTempDates] = useState([startDate, endDate]);

  const handleChange = (dates) => {
    const [start, end] = dates;
    setTempDates(dates);
    if (end) {
      onDateChange(dates);
    }
  };

  return (
    <DatePicker
      selected={tempDates[0]}
      onChange={handleChange}
      startDate={tempDates[0]}
      endDate={tempDates[1]}
      selectsRange
      minDate={new Date(2000, 0, 1)}
      className="custom-input z-50"
      calendarClassName="bg-white shadow-lg rounded-lg"
    />
  );
};

export default DateRangePicker;
