import React from "react";
import { useTranslation } from "react-i18next";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <>
      <footer className="bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 ">
          <div className=" sm:flex sm:items-center sm:justify-between ">
            <div className="flex flex-col gap-2">
              {/* Phone */}
              {/* <div className="flex items-center justify-center sm:justify-start gap-3">
                <FaPhoneAlt className="text-xl text-black" />
                <span dir="ltr" className="text-black font-medium">
                  +20 163549264
                </span>
              </div> */}

              {/* Email */}
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <FaEnvelope className="text-xl text-black" />
                <span className="text-black font-medium">
                  support@ss-solution.org
                </span>
              </div>

              {/* Address */}
              <div className="flex items-center justify-center sm:justify-start gap-3">
                {/* <FaMapMarkerAlt className="text-xl text-black" /> */}
                <span className="text-black font-medium">
                  Powered by: SuperSmartSolutions{" "}
                </span>
              </div>
            </div>
            <ul className="flex flex-wrap justify-center gap-4 text-xs lg:justify-end">
              <li>
                <a
                  href="#"
                  className="text-gray-500 transition hover:opacity-75"
                >
                  {" "}
                  Terms & Conditions{" "}
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-gray-500 transition hover:opacity-75"
                >
                  {" "}
                  Privacy Policy{" "}
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-gray-500 transition hover:opacity-75"
                >
                  {" "}
                  Cookies{" "}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
