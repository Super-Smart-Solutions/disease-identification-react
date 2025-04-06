import React, { useState, useEffect } from "react";
import { useUserData } from "../../../hooks/useUserData";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../Button";
import CreateOrganization from "./CreateOrganization";
import DataGrid from "../../DataGrid";
import noDataImg from "../../../assets/no-data.png";
import { fetchUsers } from "../../../api/userAPI";

export default function TeamSection() {
  const { t } = useTranslation();
  const { user, refetchUserData } = useUserData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);

  useEffect(() => {
    if (user?.organization_id) {
      fetchUserData();
    }
  }, [user?.organization_id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetchUsers();
      setUsers(response?.items);
    } catch (error) {
      console.error("Failed to fetch organization data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    refetchUserData().then(() => {
      if (user?.organization_id) {
        fetchUserData();
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
        fetchUserData();
      }, 500);
      setIsInviteModalOpen(false);
    } catch (error) {
      setStatus({ error: error.message || t("invite_failed_key") });
    } finally {
      setSubmitting(false);
      setInviteLoading(false);
    }
  };

  const columnDefs = [
    { field: "name", headerName: t("name_key") },
    { field: "email", headerName: t("email_key") },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold">{t("team_key")}</h2>
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
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p>{t("loading_key")}...</p>
            </div>
          ) : users.length ? (
            <div className="space-y-4">
              <DataGrid rowData={users || []} colDefs={columnDefs} />
            </div>
          ) : (
            <div className="text-red-500">{t("failed_to_load_team_key")}</div>
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
    </div>
  );
}
