import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchInvitationById,
  acceptInvitation,
  rejectInvitation,
} from "../../../api/inviteApi";
import Button from "../../Button";
import { toast } from "react-toastify";
import { useUserData } from "../../../hooks/useUserData";
import moment from "moment";
import familyImage from "../../../assets/family.png";

const popupVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

export default function InvitationPopup({ onClose }) {
  const inviteId = localStorage.getItem("invite_id");
  const { t, i18n } = useTranslation();
  const { user, refetchUserData } = useUserData();
  const popupRef = useRef(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Fetch invitation data
  const {
    data: invitation,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["invitation", inviteId],
    queryFn: () => fetchInvitationById(inviteId),
    enabled: !!inviteId && !user?.organization_id,
    onError: () => {
      localStorage.removeItem("invite_id");
    },
  });

  // Accept invitation mutation
  const { mutate: acceptMutate, isLoading: isAccepting } = useMutation({
    mutationFn: () => acceptInvitation(inviteId),
    onSuccess: () => {
      toast.success(t("invitation_accepted_key"));
      refetchUserData();
      localStorage.removeItem("invite_id");
      onClose();
    },
    onError: () => {
      toast.error(t("invitation_accept_error_key"));
      onClose();
    },
  });

  // Reject invitation mutation
  const { mutate: rejectMutate, isLoading: isRejecting } = useMutation({
    mutationFn: () => rejectInvitation(inviteId),
    onSuccess: () => {
      toast.success(t("invitation_rejected_key"));
      localStorage.removeItem("invite_id");
      onClose();
    },
    onError: () => {
      toast.error(t("invitation_reject_error_key"));
      onClose();
    },
  });

  const handleAccept = () => {
    acceptMutate();
  };

  const handleDecline = () => {
    rejectMutate();
  };

  if (!inviteId || isError || user?.organization_id) return null;

  return (
    <div className="overlay">
      <motion.div
        ref={popupRef}
        className={`bg-white rounded-lg shadow-xl p-6 w-full max-w-md ${
          i18n.dir() === "rtl" ? "text-right" : "text-left"
        }`}
        variants={popupVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className=" space-y-2">
            <h3 className="text-xl font-bold text-gray-800">
              {t("invitation_title_key")}
            </h3>
            <p className=" text-lg font-medium text-gray-800 text-center capitalize ">
              {t("invitation_message_key", {
                name: invitation?.organization_admin_name,
                team: invitation?.organization_name,
              })}
            </p>
            <img
              src={familyImage}
              alt="Organization"
              className="w-10/12 max-h-60  mx-auto object-cover "
            />

            <div
              className={`flex gap-4 ${
                i18n.dir() === "rtl" ? "flex-row-reverse" : ""
              }`}
            >
              <Button
                variant="outlined"
                onClick={handleDecline}
                className="flex-1"
                loading={isRejecting}
                disabled={isAccepting || isRejecting}
              >
                {t("decline_key")}
              </Button>
              <Button
                onClick={handleAccept}
                className="flex-1"
                loading={isAccepting}
                disabled={isAccepting || isRejecting}
              >
                {t("accept_key")}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
