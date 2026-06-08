"use client";

import SimpleListPage from "@/components/common/SimpleListPage";

const NodeList = () => {
  return (
    <SimpleListPage
      modelName="node"
      keys={["identifier", "path", "roles"]}
      enableToggle={false}
    />
  );
};

export default NodeList;