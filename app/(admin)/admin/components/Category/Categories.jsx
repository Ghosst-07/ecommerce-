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
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Categories</h2>
      <button
        onClick={() => openModal("add")}
        className="bg-blue-500 flex flex-row justify-center items-center gap-2 hover:bg-blue-600 text-white px-4 py-2 rounded-md mb-4"
      >
        <PlusCircle size={16} /> Add New Category
      </button>

      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-96">
            <h3 className="text-lg font-semibold mb-4">
              {modal.type === "add" ? "Add New Category" : "Edit Category"}
            </h3>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {successMessage && (
              <p className="text-green-500 mb-2">{successMessage}</p>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                {modal.type === "add" ? "Add" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display categories */}
      <h3 className="text-lg font-semibold mt-6 mb-2">Existing Categories</h3>
      {isLoading ? (
        <p>Loading categories...</p>
      ) : (
        <ul>
          {categories.map((category) => (
            <li key={category._id} className="mb-2 flex items-center">
              <span className="flex-grow">
                {category.name} - {category.description}
              </span>
              <button
                onClick={() => openModal("edit", category)}
                className="text-blue-500 hover:text-blue-600 mr-2"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDeleteCategory(category._id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Categories;
