import {
  LayoutDashboard,
  List,
  Package,
  ShoppingCart,
  Users,
  Settings,
} from "lucide-react";

export const menuItems = [
  {
    label: "Dashboard Home",
    icon: <LayoutDashboard className="w-5 h-5" />,
    tab: "dashboard",
  },
  {
    label: "Categories",
    icon: <List className="w-5 h-5" />,
    tab: "categories", // Added tab for Categories
  },
  {
    label: "Products",
    icon: <Package className="w-5 h-5" />,
    subItems: [
      { label: "Link products to categories", tab: "linkProduct" },
      { label: "Add", tab: "addProduct" },
      { label: "Edit", tab: "editProduct" },
      { label: "Delete", tab: "deleteProduct" },
    ],
    tab: "products", // Added tab for Products
  },
  {
    label: "Orders",
    icon: <ShoppingCart className="w-5 h-5" />,
    subItems: [
      { label: "View", tab: "viewOrders" },
      { label: "Update order statuses", tab: "updateOrderStatus" },
    ],
    tab: "orders", // Added tab for Orders
  },
  {
    label: "Users",
    icon: <Users className="w-5 h-5" />,
    subItems: [
      { label: "Manage customers", tab: "manageCustomers" },
      { label: "Manage admins", tab: "manageAdmins" },
    ],
    tab: "users", // Added tab for Users
  },
  {
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    tab: "settings",
  },
];
