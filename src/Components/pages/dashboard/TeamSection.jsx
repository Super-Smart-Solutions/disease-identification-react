import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserData } from "../../../hooks/useUserData";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../Button";
import CreateOrganization from "./CreateOrganization";
import DataGrid from "../../DataGrid";
import noDataImg from "../../../assets/no-data.png";
import { deleteUserById, fetchUsers } from "../../../api/userAPI";
import { FiTrash } from "react-icons/fi";
import ConfirmationModal from "../../ConfirmationModal";
import { useUserTeam } from "../../../api/useUserTeam";

export default function TeamSection() {
  const { t } = useTranslation();
  const { user, refetchUserData } = useUserData();
  const { data: teamData } = useUserTeam(user?.organization_id);

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
    enabled: !!user?.organization_id,
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
  });

  const handleSuccess = () => {
    setIsModalOpen(false);
    refetchUserData().then(() => {
      if (user?.organization_id) {
        refetchUsers();
      }
    });
  };

  const inviteSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("email_invalid_key"))
      .required(t("email_required_key")),
  });

  const handleInviteSubmit = async (
    values,
    { setSubmitting, resetForm, setStatus }
  ) => {
    try {
      setInviteLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus({ success: true });
      resetForm();
      setTimeout(() => {
        refetchUsers();
      }, 500);
      setIsInviteModalOpen(false);
    } catch (error) {
      setStatus({ error: error.message || t("invite_failed_key") });
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
      refetchUsers(); // Refresh list
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
            className={`px-3 py-1 rounded-full text-xs font-medium  ${
              status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {t(status ? "active_key" : "inactive_key")}
          </span>
        );
      },
    },
    {
      field: "remove",
      headerName: t("actions_key"), // No header for icon actions
      width: 80,
      cellRenderer: (params) => (
        <>
          {params?.data?.id !== user?.id && (
            <button
              className="text-gray-600 hover:text-gray-800 transition cursor-pointer p-2 hover:bg-gray-200 rounded-full"
              onClick={() => handleRemoveUser(params?.data?.id)}
              title={t("remove_user_key")}
            >
              <FiTrash size={18} />
            </button>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold">
          {`${t("team_key")}  ${teamData?.name}`}{" "}
        </h2>
        {user?.organization_id && (
          <Button onClick={() => setIsInviteModalOpen(true)}>
            {t("invite_key")}
          </Button>
        )}
      </div>
      {!user?.organization_id ? (
        <>
          <div className="cardIt flex flex-col gap-4 items-center text-center">
            <img src={noDataImg} alt="" className="max-h-60" />
            <span className="text-xl">{t("no_such_team_key")}</span>
            <Button onClick={() => setIsModalOpen(true)}>
              {t("create_team_key")}
            </Button>
          </div>

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
        </>
      ) : (
        <>
          {error ? (
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
          )}
        </>
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
              {({ status, isSubmitting }) => (
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

                  {status?.error && (
                    <div className="mb-4 text-red-500 text-sm">
                      {status.error}
                    </div>
                  )}

                  {status?.success && (
                    <div className="mb-4 text-green-500 text-sm">
                      {t("invite_sent_successfully_key")}
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => {
                        setIsInviteModalOpen(false);
                      }}
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
      {isDeleteModalOpen && (
        <ConfirmationModal
          title={t("confirm_remove_user_key")}
          message={t("are_you_sure_delete_user_key")}
          onConfirm={confirmDeleteUser}
          onCancel={() => setIsDeleteModalOpen(false)}
          loading={deletingUser}
        />
      )}
    </div>
  );
}
