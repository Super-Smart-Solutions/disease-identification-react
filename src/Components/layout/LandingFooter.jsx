import React from "react";
import { useTranslation } from "react-i18next";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import logo from "../../assets/logoDark.png";

export default function LandingFooter() {
  const { t } = useTranslation();
  return (
    <>
      <footer className="text-white">
        <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-8 sm:px-6 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 flex w-full justify-between items-end ">
            <div className="flex flex-col gap-2">
              {/* Phone */}
              {/* <div className="flex items-center justify-center sm:justify-start gap-3">
                <FaPhoneAlt className=" " />
                <span dir="ltr" className=" font-medium">
                  +20 163549264
                </span>
              </div> */}

              {/* Email */}
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <FaEnvelope className=" " />
                <span className=" font-medium">support@ss-solution.org</span>
              </div>

              {/* Address */}
              <div className="flex items-center justify-center sm:justify-start gap-3">
                {/* <FaMapMarkerAlt className=" " /> */}
                <span className=" font-medium">
                  Powered by: SuperSmartSolutions{" "}
                </span>
              </div>
            </div>
            <div className="flex justify-center my-4 sm:my-0">
              <img src={logo} alt="Company Logo" className="h-30 w-auto shadow-2xl contrast-75 opacity-80" />
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
