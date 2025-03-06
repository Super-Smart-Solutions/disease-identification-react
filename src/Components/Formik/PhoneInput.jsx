import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import countries from "world-countries";

const PhoneInput = ({
  className = "",
  onChange,
  initialCountry = "",
  initialPhoneNumber = "",
  countryDropdownClassName = "",
  phoneInputClassName = "",
  placeholder = "Phone number",
  searchPlaceholder = "Search",
  dropdownVisible = false,
  onDropdownToggle,
  isRTL = false, // Prop to control RTL/LTR
}) => {
  // Map countries data to match the required format
  const uniqueCountries = countries.map((country) => ({
    value: country.cca2,
    label: country.name.common,
    countryCallingCode: `${country.idd.root}${country.idd.suffixes[0]}`, // Get the calling code
    flag: `https://flagcdn.com/w320/${country.cca2.toLowerCase()}.png`,
  }));

  const [selectedCountry, setSelectedCountry] = useState(
    () =>
      uniqueCountries.find(
        (country) => country.countryCallingCode === initialCountry
      ) || uniqueCountries[0]
  );
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(dropdownVisible);
  const [dropdownDirection, setDropdownDirection] = useState("down"); // 'up' or 'down'
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  // Handle country selection
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setPhoneNumber("");
    onChange &&
      onChange({
        country,
        phoneNumber: "",
      });
    setIsDropdownVisible(false);
    onDropdownToggle && onDropdownToggle(false);
  };

  // Handle phone number input change
  const handlePhoneNumberChange = (e) => {
    const number = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    setPhoneNumber(number);

    onChange && onChange({ country: selectedCountry, phoneNumber: number });
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
    onDropdownToggle && onDropdownToggle(!isDropdownVisible);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsDropdownVisible(false);
        onDropdownToggle && onDropdownToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Determine dropdown direction based on available space
  useEffect(() => {
    if (isDropdownVisible && dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - dropdownRect.bottom;
      const spaceAbove = dropdownRect.top;

      if (spaceBelow < 200 && spaceAbove > 200) {
        setDropdownDirection("up");
      } else {
        setDropdownDirection("down");
      }
    }
  }, [isDropdownVisible]);

  // Filter countries based on search query
  const filteredCountries = uniqueCountries.filter((country) =>
    country.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={classNames(
        "flex flex-col sm:flex-row items-center gap-2",
        className,
        {
          "rtl:text-right ltr:text-left": true, // Align text based on direction
        }
      )}
      ref={containerRef}
    >
      {/* Country Dropdown */}
      <div className={`relative w-full sm:w-auto ${countryDropdownClassName}`}>
        <div
          className={classNames(
            "flex items-center justify-between px-4 py-2 border-gray-400 border  bg-gray-100 cursor-pointer",
            {
              "rtl:rounded-r-lg ltr:rounded-l-lg": true, // Round corners based on direction
            }
          )}
          onClick={toggleDropdown}
        >
          <img
            src={selectedCountry.flag}
            className={classNames("w-4 rounded", {
              "rtl:ml-2 ltr:mr-2": true, // Margin based on direction
            })}
            alt=""
          />
          <span>{selectedCountry.countryCallingCode}</span>
          <svg
            className={classNames("w-4 h-4", {
              "rtl:mr-2 ltr:ml-2": true, // Margin based on direction
            })}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1l4 4 4-4"
            />
          </svg>
        </div>
        {isDropdownVisible && (
          <div
            ref={dropdownRef}
            className={classNames(
              "absolute z-10 bg-white rounded-lg shadow-lg w-full sm:w-52 transition-all duration-300 ease-in-out",
              {
                "mt-1": dropdownDirection === "down", // Open downwards
                "mb-1 bottom-full": dropdownDirection === "up", // Open upwards
              }
            )}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className={classNames("input h-7 my-1 mx-1 w-11/12 text-sm", {
                "rtl:text-right ltr:text-left": true, // Align text based on direction
              })}
            />
            <ul className="py-2 max-h-40 overflow-auto text-sm text-gray-700 px-0">
              {filteredCountries?.map((country) => (
                <li
                  key={country.countryCallingCode}
                  className={classNames(
                    "px-4 py-2 cursor-pointer flex items-center",
                    {
                      "bg-[#416a00] bg-opacity-80 text-white":
                        selectedCountry?.countryCallingCode ===
                        country?.countryCallingCode, // Primary color for selected option
                      "hover:bg-[#416a00] hover:text-white": true, // Primary color on hover
                    }
                  )}
                  onClick={() => handleCountryChange(country)}
                >
                  <img
                    src={country.flag}
                    className={classNames("w-4 rounded", {
                      "rtl:ml-2 ltr:mr-2": true, // Margin based on direction
                    })}
                    alt=""
                  />
                  <span>{country.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Phone Number Input */}
      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder={placeholder}
        className={classNames(
          " custom-input rtl:rounded-l-lg ltr:rounded-r-lg rtl:text-right ltr:text-left rounded-none"
        )}
        pattern="[0-9]*"
        inputMode="numeric"
      />
    </div>
  );
};

export default PhoneInput;
