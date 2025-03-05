import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

function Categories() {
  const [modal, setModal] = useState({ isOpen: false, type: "add" }); // Modal state with type
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [categories, setCategories] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null); // Add editingCategory state

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/getcategory");
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const openModal = (type = "add", category = null) => {
    setModal({ isOpen: true, type });
    setError(null);
    setSuccessMessage(null);
    if (type === "edit" && category) {
      setCategoryName(category.name);
      setCategoryDescription(category.description);
      setEditingCategory(category);
    }
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: "add" });
    setCategoryName("");
    setCategoryDescription("");
    setError(null);
    setSuccessMessage(null);
    setEditingCategory(null);
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch(
        modal.type === "add"
          ? "/api/admin/addcategory"
          : `/api/admin/editcategory/${editingCategory._id}`,
        {
          method: modal.type === "add" ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: categoryName,
            description: categoryDescription,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(
          modal.type === "add"
            ? "Category added successfully"
            : "Category updated successfully"
        );
        if (modal.type === "add") {
          setCategories([...categories, data.category]);
        } else {
          setCategories(
            categories.map((c) =>
              c._id === editingCategory._id ? data.category : c
            )
          );
        }
        setTimeout(closeModal, 1500);
      } else {
        setError(data.error || "Failed to add category");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`/api/admin/deletecategory/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCategories(categories.filter((c) => c._id !== categoryId));
      } else {
        console.error("Failed to delete category");
        // Handle error (e.g., display an error message)
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      // Handle error
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Manage Categories
      </h2>
      <button
        onClick={() => openModal("add")}
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mb-6 transition-all duration-300"
      >
        <PlusCircle size={18} /> Add New Category
      </button>

      {/* Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-2xl transform transition-all duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {modal.type === "add" ? "Add New Category" : "Edit Category"}
            </h3>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {successMessage && (
              <p className="text-green-500 text-sm mb-4">{successMessage}</p>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all duration-300"
              >
                {modal.type === "add" ? "Add" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display categories */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Existing Categories
      </h3>
      {isLoading ? (
        <p className="text-gray-600">Loading categories...</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <li
              key={category._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col justify-between"
            >
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {category.name}
                </h4>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => openModal("edit", category)}
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-300"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  className="text-red-600 hover:text-red-700 transition-colors duration-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Categories;
