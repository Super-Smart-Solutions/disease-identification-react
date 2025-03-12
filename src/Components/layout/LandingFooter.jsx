import React from "react";
import { useTranslation } from "react-i18next";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function LandingFooter() {
  const { t } = useTranslation();
  return (
    <>
      <footer className="text-white">
        <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-8 sm:px-6 lg:px-8 lg:pt-24">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold  sm:text-5xl">
              مرشدك الزراعي - Murshiduk{" "}
            </h2>

            <p className="mx-auto mt-4 max-w-sm ">{t("subtitle_key")}</p>

            <a
              href="#"
              className="mt-8 inline-block rounded-full border border-white px-12 py-3 text-sm font-medium text-white hover:bg-primary hover:border-primary"
            >
              Get Started
            </a>
          </div>

          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 ">
            <div className="flex flex-col gap-2">
              {/* Phone */}
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <FaPhoneAlt className=" " />
                <span dir="ltr" className=" font-medium">
                  +20 163549264
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <FaEnvelope className=" " />
                <span className=" font-medium">info@myrsgidk.com</span>
              </div>

              {/* Address */}
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <FaMapMarkerAlt className=" " />
                <span className=" font-medium">
                  Lorem ipsum dolor sit amet consectetur
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
