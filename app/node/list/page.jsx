"use client";

import CommonListPage from "@/components/common/CommonListPage";

const NodeList = () => {
  return (
    <CommonListPage
      modelName="node"
      keys={["identifier", "path", "roles"]}
      enableToggle={false}
    />
  );
};

export default NodeList;