// app/components/DashboardHome.jsx
"use client";

import React from "react";

const DashboardHome = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium mb-2">Total Products</h2>
          <p className="text-2xl font-bold">150</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium mb-2">Total Categories</h2>
          <p className="text-2xl font-bold">10</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium mb-2">Total Orders</h2>
          <p className="text-2xl font-bold">250</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium mb-2">Total Users</h2>
          <p className="text-2xl font-bold">500</p>
        </div>
      </div>

      {/* Charts and Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium mb-2">Sales Chart</h2>
          <div className="h-64">
            {/* Dummy Sales Chart */}
            <div className="relative h-full">
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-blue-500"></div>
              <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-blue-300"></div>
              <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-100"></div>
            </div>
          </div>
        </div>

        {/* Orders Graph */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium mb-2">Orders Graph</h2>
          <div className="h-64">
            {/* Dummy Orders Graph */}
            <div className="relative h-full">
              <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-green-500"></div>
              <div className="absolute bottom-0 left-1/4 w-1/4 h-3/4 bg-green-300"></div>
              <div className="absolute bottom-0 left-1/2 w-1/4 h-1/4 bg-green-100"></div>
              <div className="absolute bottom-0 left-3/4 w-1/4 h-2/4 bg-green-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
