import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchInvitations,
  acceptInvitation,
  rejectInvitation,
} from "../../../api/inviteApi";
import Button from "../../Button";
import { toast } from "sonner";
import { useUserData } from "../../../hooks/useUserData";
import Pagination from "../../Pagination";
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
  const { t, i18n } = useTranslation();
  const { user, refetchUserData } = useUserData();
  const popupRef = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const { data: invitationsData } = useQuery({
    queryKey: ["invitations", page, pageSize],
    queryFn: () => fetchInvitations({ page, size: pageSize }),
    enabled: !user?.organization_id,
    onError: () => {
      toast.error(t("invitations_fetch_error_key"));
    },
  });

  const { mutate: acceptMutate, isLoading: isAccepting } = useMutation({
    mutationFn: (inviteId) => acceptInvitation(inviteId),
    onSuccess: () => {
      toast.success(t("invitation_accepted_key"));
      refetchUserData();
      onClose();
    },
    onError: () => {
      toast.error(t("invitation_accept_error_key"));
    },
  });

  const { mutate: rejectMutate, isLoading: isRejecting } = useMutation({
    mutationFn: (inviteId) => rejectInvitation(inviteId),
    onSuccess: () => {
      toast.success(t("invitation_rejected_key"));
      onClose();
    },
    onError: () => {
      toast.error(t("invitation_reject_error_key"));
    },
  });

  const handleAccept = (inviteId) => {
    acceptMutate(inviteId);
  };

  const handleDecline = (inviteId) => {
    rejectMutate(inviteId);
  };

  const invitations =
    invitationsData?.items?.filter(
      (invitation) => invitation.status === "pending"
    ) || [];
  const totalPages = invitationsData?.pages || 1;
  const totalItems = invitationsData?.total || 0;

  // Only render modal if user is not in an organization and there are invitations
  if (user?.organization_id || invitations.length === 0) {
    return null;
  }

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
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">
            {t("invitation_title_key")}
          </h3>
          {invitations.map((invitation) => (
            <div key={invitation.id} className="space-y-2  pb-4">
              <p className="text-lg font-medium text-gray-800 text-center capitalize">
                {t("invitation_message_key", {
                  name: invitation.organization_admin_name,
                  team: invitation.organization_name,
                })}
              </p>
              {invitations.length === 1 && (
                <img
                  src={familyImage}
                  alt="Organization"
                  className="w-10/12 max-h-60 mx-auto object-cover"
                />
              )}
              <div
                className={`flex gap-4 ${
                  i18n.dir() === "rtl" ? "flex-row-reverse" : ""
                }`}
              >
                <Button
                  variant="outlined"
                  onClick={() => handleDecline(invitation.id)}
                  className="flex-1"
                  loading={isRejecting}
                  disabled={isAccepting || isRejecting}
                >
                  {t("decline_key")}
                </Button>
                <Button
                  onClick={() => handleAccept(invitation.id)}
                  className="flex-1"
                  loading={isAccepting}
                  disabled={isAccepting || isRejecting}
                >
                  {t("accept_key")}
                </Button>
              </div>
            </div>
          ))}
          {invitations.length > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}
