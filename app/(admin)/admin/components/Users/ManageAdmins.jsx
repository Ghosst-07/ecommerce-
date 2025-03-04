import React, { useState, useEffect } from "react";
import { Search, Eye, Trash, Edit, CheckCircle, XCircle } from "lucide-react";

function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    async function fetchAdmins() {
      try {
        const response = await fetch("/api/admin/getusers");
        if (response.ok) {
          const data = await response.json();
          setAdmins(data);
        } else {
          console.error("Failed to fetch admins");
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAdmins();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin({ ...newAdmin, [name]: value });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewAdmin({ name: "", email: "", password: "", role: "admin" });
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/adduser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Failed to add admin");
        setIsSuccess(false);
        return;
      }

      setAdmins([...admins, result.admin]);
      setMessage("Admin added successfully!");
      setIsSuccess(true);
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (error) {
      setMessage("Error adding admin");
      setIsSuccess(false);
      console.error("Error adding admin:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search here..."
              className="w-full p-2 border rounded-md pl-10 focus:ring focus:ring-blue-200"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={openModal}
          >
            + Add new
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-700">
                <th className="py-2">User</th>
                <th className="py-2">Email</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : admins.length > 0 ? (
                admins.map((admin) => (
                  <tr key={admin._id} className="border-t border-gray-200">
                    <td className="py-4">{admin.name}</td>
                    <td className="py-4">{admin.email}</td>
                    <td className="py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-500 hover:text-blue-600">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="text-yellow-500 hover:text-yellow-600">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="text-red-500 hover:text-red-600">
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    No admins found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Admin</h2>
            {message && (
              <div
                className={`p-2 mb-4 rounded-md flex items-center gap-2 ${
                  isSuccess
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isSuccess ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}{" "}
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              {["name", "email", "password"].map((field) => (
                <div key={field} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field === "password" ? "password" : "text"}
                    name={field}
                    value={newAdmin[field]}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded-md w-full"
                  />
                </div>
              ))}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Add Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageAdmins;
