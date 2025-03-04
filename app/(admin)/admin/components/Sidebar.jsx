import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { menuItems } from "./menuItems";

function Sidebar({ setSelectedTab }) {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [selected, setSelected] = useState(null);
  const [parentSelected, setParentSelected] = useState(null);

  const toggleSubmenu = (label) => {
    setOpenSubmenu((prev) => (prev === label ? null : label));
    setParentSelected(null);
  };

  const handleTabSelect = (tab, parentLabel) => {
    setSelected(tab);
    setSelectedTab(tab);
    if (parentLabel) {
      setParentSelected(tab);
    } else {
      setParentSelected(null);
    }
  };

  const handleParentSelect = (tab) => {
    setSelected(tab);
    setSelectedTab(tab);
    setParentSelected(tab);
  };

  const renderMenuItems = (items) =>
    items.map((item) => (
      <li
        key={item.label}
        className={`p-3 cursor-pointer rounded-lg transition-colors duration-200 ease-in-out ${
          parentSelected === item.tab
            ? "bg-indigo-100 text-indigo-700 font-medium"
            : selected === item.tab && !item.subItems
            ? "bg-indigo-100 text-indigo-700 font-medium"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <div
          className="flex justify-between items-center"
          onClick={() => {
            if (item.subItems) {
              handleParentSelect(item.tab);
            } else {
              handleTabSelect(item.tab, null);
            }
          }}
        >
          <div className="flex items-center gap-3 font-medium">
            {item.icon}
            <span>{item.label}</span>
          </div>
          {item.subItems && (
            <span
              className="ml-2"
              onClick={(e) => {
                e.stopPropagation();
                toggleSubmenu(item.label);
              }}
            >
              {openSubmenu === item.label ? (
                <ChevronUp className="w-4 h-4 text-gray-500 transition-transform duration-200" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-200" />
              )}
            </span>
          )}
        </div>
        <div
          className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
            openSubmenu === item.label
              ? "max-h-96 opacity-100 mt-2"
              : "max-h-0 opacity-0"
          }`}
          style={{ transitionProperty: "max-height, opacity" }}
        >
          {item.subItems && (
            <ul className="ml-6 pl-3 border-l-2 border-gray-200">
              {item.subItems.map((subItem) => (
                <li
                  key={subItem.label}
                  className={`relative flex items-center p-2 cursor-pointer rounded-md transition-colors duration-200 ease-in-out ${
                    selected === subItem.tab
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTabSelect(subItem.tab, item.label);
                  }}
                >
                  {subItem.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </li>
    ));

  return (
    <div className="fixed w-64 h-full bg-white text-gray-800 shadow-xl border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Panel</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your workspace</p>
      </div>
      <ul className="mt-4 px-3 space-y-1">{renderMenuItems(menuItems)}</ul>
    </div>
  );
}

export default Sidebar;
