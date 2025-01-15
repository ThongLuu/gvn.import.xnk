import React from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  const menuItems = [
    { name: "Main", url: "/", icon: "pi pi-home" },
    { name: "Build PC", url: "/pages/build-pc", icon: "pi pi-cog" },
    {
      name: "Export",
      url: "/pages/export-build-pc",
      icon: "pi pi-file-export",
    },
  ];

  return (
    <div
      className="h-full w-44 bg-red-800 text-white flex flex-col"
      style={{ flexShrink: "0" }}
    >
      {/* Header */}
      <div className="p-4">
        <h2 className="text-lg font-bold">Menu</h2>
      </div>

      {/* Menu Items */}
      <ul className="flex-grow overflow-y-auto px-2">
        {menuItems.map((item, index) => (
          <li key={index} className="mb-2">
            <Link
              to={item.url}
              className="flex items-center p-2 rounded hover:bg-red-600"
            >
              <i className={`${item.icon} mr-2`}></i>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="p-4 text-sm text-gray-300">© 2025 Sidebar App</div>
    </div>
  );
};

export default SideBar;
