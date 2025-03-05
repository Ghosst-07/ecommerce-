import React from "react";
import { signOut } from "next-auth/react";

function Settings() {
  const handleLogout = () => {
    signOut();
  };

  return (
    <div>
      <div>Settings Content</div>
      <button
        className="p-2 bg-red-400 rounded-lg text-white mt-10 ml-10 shadow-md cursor-pointer hover:bg-red-500"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
  );
}

export default Settings;
