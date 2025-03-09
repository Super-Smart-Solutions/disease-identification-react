import React from "react";
import ImageGrid from "../Components/pages/ImageGrid";
import ExpandableArticle from "../Components/pages/ExpandableArticle";

export default function DataBase() {
  return (
    <div className=" space-y-12">
      <ExpandableArticle />
      <ImageGrid />
    </div>
  );
}
