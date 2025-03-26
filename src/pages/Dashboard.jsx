import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TeamSection from "../Components/pages/dashboard/TeamSection";

export default function Dashboard() {
  const { t } = useTranslation();
  return (
    <div className=" flex flex-col gap-2">
      <div className=" flex flex-col gap-2">
        <TeamSection />
      </div>
    </div>
  );
}
