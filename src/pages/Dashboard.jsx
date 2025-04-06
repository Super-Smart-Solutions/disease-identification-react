import React from "react";
import TeamSection from "../Components/pages/dashboard/TeamSection";
import LogsSection from "../Components/pages/dashboard/LogsSection";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <TeamSection />
      <LogsSection />
    </div>
  );
}
