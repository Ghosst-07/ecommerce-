"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Content from "./components/Content";

function AdminHome() {
  const { data: session, status } = useSession();
  const [selectedTab, setSelectedTab] = useState("dashboard");

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Access Denied. Please log in.</p>;

  return (
    <div className="flex">
      <Sidebar setSelectedTab={setSelectedTab} />
      <Content selectedTab={selectedTab} />
    </div>
  );
}

export default AdminHome;
