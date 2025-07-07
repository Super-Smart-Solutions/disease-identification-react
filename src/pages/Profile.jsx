import React from "react";
import TeamSection from "../Components/pages/dashboard/TeamSection";
import ProfileHeader from "../Components/pages/profile/ProfileHeader";

export default function Profile() { 
  
  return (
    <div className=" space-y-4">
      <ProfileHeader />
      <TeamSection /> 
    </div>
  );
}
