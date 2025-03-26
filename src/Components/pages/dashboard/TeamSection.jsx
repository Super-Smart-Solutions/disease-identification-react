import React, { useState, useEffect } from "react";
import { useUserData } from "../../../hooks/useUserData";
import { useTranslation } from "react-i18next";
import Button from "../../Button";
import CreateOrganization from "./CreateOrganization";
import { getOrganizations } from "../../../api/organizationsApi";
import DataGrid from "../../DataGrid";
import noDataImg from "../../../assets/no-data.png";

export default function TeamSection() {
  const { t } = useTranslation();
  const { user, refetchUserData } = useUserData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [organizationData, setOrganizationData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.organization_id) {
      fetchOrganizationData();
    }
  }, [user?.organization_id]);

  const fetchOrganizationData = async () => {
    try {
      setLoading(true);
      const response = await getOrganizations();
      setOrganizationData(response.data);
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
        fetchOrganizationData();
      }
    });
  };

  const columnDefs = [
    { field: "id", headerName: "#", width: 100 },
    { field: "name", headerName: t("name_key") },
    { field: "email", headerName: t("email_key") },
    { field: "role", headerName: t("role_key") },
    { field: "status", headerName: t("status_key") },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{t("team_key")}</h2>

      {!user?.organization_id ? (
        <>
          <div className="cardIt flex flex-col gap-4 items-center text-center">
            <img src={noDataImg} alt="" className=" max-h-60" />
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
          ) : organizationData ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium">
                  {organizationData.name} {t("team_key")}
                </h3>
                <Button variant="outlined" size="sm">
                  {t("manage_team_key")}
                </Button>
              </div>
              <DataGrid
                rowData={organizationData.members || []}
                columnDefs={columnDefs}
                loading={loading}
              />
            </div>
          ) : (
            <div className="text-red-500">{t("failed_to_load_team_key")}</div>
          )}
        </>
      )}
    </div>
  );
}
