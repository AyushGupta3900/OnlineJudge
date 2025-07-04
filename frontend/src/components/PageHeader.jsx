import React from "react";
import { FaClipboardList } from "react-icons/fa";

const PageHeader = ({ heading }) => {
  return (
    <div className="flex items-center gap-3 mb-8">
      <FaClipboardList className="text-4xl text-blue-500" />
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        {heading}
      </h1>
    </div>
  );
};

export default PageHeader;