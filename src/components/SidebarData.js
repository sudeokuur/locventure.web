import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
  {
    title: "Created Event",
    path: "/created-event", // URL dostu yol
    icon: <AiIcons.AiFillContainer />,
    cName: "nav-text",
  },
  {
    title: "Create Event",
    icon: <AiIcons.AiFillPlusCircle />, // İkon adındaki yazım hatası düzeltildi
    path: "/create-event",
    cName: "nav-text",
  },
  {
    title: "Statistics",
    path: "/statistics",
    icon: <AiIcons.AiFillFund />,
    cName: "nav-text",
  },
  {
    title: "AddCompanyUser",
    path: "/add-company-user",
    icon: <FaIcons.FaBuilding />,
    cName: "nav-text",
  }
];
