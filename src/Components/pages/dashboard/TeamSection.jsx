import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserData } from "../../../hooks/useUserData";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../Button";
import CreateOrganization from "./CreateOrganization";
import noDataImg from "../../../assets/no-data.png";
import { deleteUserById, fetchUsers } from "../../../api/userAPI";
import { FiTrash } from "react-icons/fi";
import ConfirmationModal from "../../ConfirmationModal";
import { useUserTeam } from "../../../api/useUserTeam";
import { createInvitation } from "../../../api/inviteApi";
import { toast } from "sonner";
import DataGrid from "../../DataGrid";

export default function TeamSection() {
  const { t } = useTranslation();
  const { user, refetchUserData } = useUserData();
  const { data: teamData } = useUserTeam(user?.organization_id);
  const isInOrganization = !!user?.organization_id;
  const isAdmin = user?.is_org_admin;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);

  const fetchUsersData = useCallback(
    () =>
      fetchUsers({
        organizationId: user?.organization_id,
        page,
        size: pageSize,
      }),
    [user?.organization_id, page, pageSize]
  );

  const {
    data: usersData,
    isLoading,
    error,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["organizationUsers", user?.organization_id, page, pageSize],
    queryFn: fetchUsersData,
    enabled: isInOrganization && isAdmin, // Only fetch if user is admin in organization
    staleTime: 1000 * 60 * 5,
  });

  const handleSuccess = () => {
    setIsModalOpen(false);
    refetchUserData();
  };

  const inviteSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("email_invalid_key"))
      .required(t("required_field_key")),
  });

  const handleInviteSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setInviteLoading(true);
      await createInvitation({ invitee_email: values.email });
      toast.success(t("invite_sent_successfully_key"));
      resetForm();
      refetchUsers();
      setIsInviteModalOpen(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.detail || error.message || t("invite_failed_key")
      );
    } finally {
      setSubmitting(false);
      setInviteLoading(false);
    }
  };

  const handleRemoveUser = (userId) => {
    setUserToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      setDeletingUser(true);
      await deleteUserById(userToDelete);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      refetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
    } finally {
      setDeletingUser(false);
    }
  };

  const columnDefs = [
    {
      field: "first_name",
      headerName: t("name_key"),
    },
    {
      field: "email",
      headerName: t("email_key"),
    },
    {
      field: "is_active",
      headerName: t("status_key"),
      cellRenderer: (params) => {
        const status = params?.value;
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {t(status ? "active_key" : "inactive_key")}
          </span>
        );
      },
    },
    ...(isAdmin
      ? [
          {
            field: "remove",
            headerName: t("actions_key"),
            width: 80,
            cellRenderer: (params) =>
              params?.data?.id !== user?.id && (
                <button
                  className="text-gray-600 hover:text-gray-800 transition cursor-pointer p-2 hover:bg-gray-200 rounded-full"
                  onClick={() => handleRemoveUser(params?.data?.id)}
                  title={t("remove_user_key")}
                >
                  <FiTrash size={18} />
                </button>
              ),
          },
        ]
      : []),
  ];

  // Render based on user's organization status
  const renderContent = () => {
    if (!isInOrganization) {
      return (
        <div className="cardIt flex flex-col gap-4 items-center text-center">
          <img src={noDataImg} alt="" className="max-h-60" />
          <span className="text-xl">{t("no_such_team_key")}</span>
          <Button onClick={() => setIsModalOpen(true)}>
            {t("create_team_key")}
          </Button>
        </div>
      );
    }

    return (
      <>
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold">
            {`${t("team_key")} ${teamData?.name}`}
          </h2>
          {isAdmin && (
            <Button onClick={() => setIsInviteModalOpen(true)}>
              {t("invite_key")}
            </Button>
          )}
        </div>

        {isAdmin ? (
          error ? (
            <div className="text-red-500">{t("failed_to_load_team_key")}</div>
          ) : (
            <div className="space-y-4">
              <DataGrid
                rowData={usersData?.items || []}
                colDefs={columnDefs}
                loading={isLoading}
                pagination={true}
                currentPage={page}
                pageSize={pageSize}
                totalItems={usersData?.total}
                totalPages={usersData?.pages}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </div>
          )
        ) : (
          <div className="text-lg text-gray-600">
            {t("member_of_team_key")} <strong>{teamData?.name}</strong>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-4">
      {renderContent()}

      {/* Create Organization Modal */}
      {isModalOpen && (
        <div className="overlay">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <CreateOrganization
              onSuccess={handleSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      {isInviteModalOpen && (
        <div className="overlay">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {t("invite_user_key")}
            </h3>

            <Formik
              initialValues={{ email: "" }}
              validationSchema={inviteSchema}
              onSubmit={handleInviteSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t("email_key")}
                    </label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className="custom-input"
                      placeholder={t("enter_email_key")}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => setIsInviteModalOpen(false)}
                      disabled={isSubmitting || inviteLoading}
                    >
                      {t("cancel_key")}
                    </Button>
                    <Button
                      type="submit"
                      loading={isSubmitting || inviteLoading}
                    >
                      {t("invite_key")}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {isDeleteModalOpen && (
        <ConfirmationModal
          onConfirm={confirmDeleteUser}
          onCancel={() => setIsDeleteModalOpen(false)}
          t={t}
        />
      )}
    </div>
  );
}
