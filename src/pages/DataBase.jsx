import React from "react";
import ImageGrid from "../Components/pages/ImageGrid";
import ExpandableArticle from "../Components/pages/ExpandableArticle";
import PlantDiseaseForm from "../Components/pages/PlantDiseaseForm";
import Breadcrumbs from "../Components/layout/BreadCrumbs";
import { useTranslation } from "react-i18next";

export default function DataBase() {
  return (
    <div>
      <div className=" space-y-8 ">
        <PlantDiseaseForm />
        <ExpandableArticle />
        <ImageGrid />
      </div>
    </div>
  );
}
