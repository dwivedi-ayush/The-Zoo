import React from "react";
import { BulletList } from "react-content-loader";
const RightSidebar = () => {
  return (
    <div>
      <div className="p-6 bg-slate-100 rounded-lg ml-4 space-y-4">
        <h2 className="font-medium">Scenarios</h2>
      </div>
      <BulletList />
    </div>
  );
};

export default RightSidebar;
