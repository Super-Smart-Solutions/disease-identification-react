import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import countries from "world-countries";

const PhoneInput = ({
  className = "",
  onChange,
  initialCountry = "",
  initialPhoneNumber = "",
  countryDropdownClassName = "",
  placeholder = "Phone number",
  dropdownVisible = false,
  onDropdownToggle,
}) => {
  // Filter countries to only include Saudi Arabia and Egypt
  const filteredCountries = countries
    .filter((country) => ["SA", "EG"].includes(country.cca2))
    .map((country) => ({
      value: country.cca2,
      label: country.name.common,
      countryCallingCode: `${country.idd.root}${country.idd.suffixes[0]}`,
      flag: `https://flagcdn.com/w320/${country.cca2.toLowerCase()}.png`,
    }));

  const [selectedCountry, setSelectedCountry] = useState(
    () =>
      filteredCountries.find(
        (country) => country.countryCallingCode === initialCountry
      ) || filteredCountries[0]
  );
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [isDropdownVisible, setIsDropdownVisible] = useState(dropdownVisible);
  const [dropdownDirection, setDropdownDirection] = useState("down");
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setPhoneNumber("");
    onChange?.({ country, phoneNumber: "" });
    setIsDropdownVisible(false);
    onDropdownToggle?.(false);
  };

  const handlePhoneNumberChange = (e) => {
    const number = e.target.value.replace(/\D/g, "");
    setPhoneNumber(number);
    onChange?.({ country: selectedCountry, phoneNumber: number });
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
    onDropdownToggle?.(!isDropdownVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsDropdownVisible(false);
        onDropdownToggle?.(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isDropdownVisible && dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - dropdownRect.bottom;
      const spaceAbove = dropdownRect.top;

      setDropdownDirection(
        spaceBelow < 200 && spaceAbove > 200 ? "up" : "down"
      );
    }
  }, [isDropdownVisible]);

  return (
    <div
      className={classNames(
        "flex flex-col sm:flex-row items-center gap-2",
        className,
        { "rtl:text-right ltr:text-left": true }
      )}
      ref={containerRef}
    >
      {/* Country Dropdown */}
      <div className={`relative w-full sm:w-auto ${countryDropdownClassName}`}>
        <div
          className={classNames(
            "flex items-center justify-between px-4 py-2 border-gray-400 border bg-gray-100 cursor-pointer",
            { "rtl:rounded-r-lg ltr:rounded-l-lg": true }
          )}
          onClick={toggleDropdown}
        >
          <img
            src={selectedCountry.flag}
            className={classNames("w-4 rounded", { "rtl:ml-2 ltr:mr-2": true })}
            alt=""
          />
          <span>{selectedCountry.countryCallingCode}</span>
          <svg
            className={classNames("w-4 h-4", { "rtl:mr-2 ltr:ml-2": true })}
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
              "absolute z-10 bg-white rounded-lg shadow-md w-full sm:w-52 transition-all duration-300 ease-in-out",
              {
                "mt-1": dropdownDirection === "down",
                "mb-1 bottom-full": dropdownDirection === "up",
              }
            )}
          >
            <ul className="py-2 max-h-40 overflow-auto text-sm text-gray-700 px-0">
              {filteredCountries.map((country) => (
                <li
                  key={country.countryCallingCode}
                  className={classNames(
                    "px-4 py-2 cursor-pointer flex items-center",
                    {
                      "bg-[#416a00] bg-opacity-80 text-white":
                        selectedCountry?.countryCallingCode ===
                        country?.countryCallingCode,
                      "hover:bg-[#416a00] hover:text-white": true,
                    }
                  )}
                  onClick={() => handleCountryChange(country)}
                >
                  <img
                    src={country.flag}
                    className={classNames("w-4 rounded", {
                      "rtl:ml-2 ltr:mr-2": true,
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
          "custom-input rtl:rounded-l-lg ltr:rounded-r-lg rtl:text-right ltr:text-left rounded-none"
        )}
        pattern="[0-9]*"
        inputMode="numeric"
      />
    </div>
  );
};

export default PhoneInput;
