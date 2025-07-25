import React from "react";
import { parseIssues } from "@/lib/parseIssues";
import { MainComponent } from "@/components/main-components";

const MainContainer = () => {
  const data = parseIssues();

  return <MainComponent data={data} />;
};
export default MainContainer;
