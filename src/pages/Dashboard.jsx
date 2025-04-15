import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TeamSection from "../Components/pages/dashboard/TeamSection";
import LogsSection from "../Components/pages/dashboard/LogsSection";
import InvitationPopup from "../Components/pages/dashboard/InvitationPopup";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren",
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function Dashboard() {
  const [inviteId, setInviteId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const inviteId = localStorage.getItem("invite_id");
    if (inviteId) {
      setInviteId(inviteId);
      setShowPopup(true);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    setInviteId(null);
  };

  return (
    <>
      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={sectionVariants}>
          <TeamSection />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <LogsSection />
        </motion.div>
      </motion.div>

      {showPopup && (
        <InvitationPopup inviteId={inviteId} onClose={handleClosePopup} />
      )}
    </>
  );
}
