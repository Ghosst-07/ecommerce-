import React from "react";
import DashboardHome from "./Dashboard/DashboardHome";
import LinkProduct from "./Product/LinkProduct";
import AddProduct from "./Product/AddProduct";
import EditProduct from "./Product/EditProduct";
import DeleteProduct from "./Product/DeleteProduct";
import ViewOrders from "./Orders/ViewOrders";
import UpdateOrderStatus from "./Orders/UpdateOrderStatus";
import ManageCustomers from "./Users/ManageCustomers";
import ManageAdmins from "./Users/ManageAdmins";
import Settings from "./Settings/Settings";
import Categories from "./Category/Categories";
import Products from "./Product/Products";
import Orders from "./Orders/Orders";
import UsersPage from "./Users/UsersPage";

const contentMap = {
  dashboard: DashboardHome,
  linkProduct: LinkProduct,
  addProduct: AddProduct,
  editProduct: EditProduct,
  deleteProduct: DeleteProduct,
  viewOrders: ViewOrders,
  updateOrderStatus: UpdateOrderStatus,
  manageCustomers: ManageCustomers,
  manageAdmins: ManageAdmins,
  settings: Settings,
  categories: Categories,
  products: Products,
  orders: Orders,
  users: UsersPage,
};

function Content({ selectedTab }) {
  const SelectedComponent = contentMap[selectedTab] || DashboardHome;
  return (
    <div className="flex-grow ml-60 p-6 bg -gray-100">
      <SelectedComponent />
    </div>
  );
}

export default Content;
