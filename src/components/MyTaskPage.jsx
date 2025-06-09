import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import Nav from "./shared/Nav";
import { LayoutGrid, List, Search, SquareCheckBig } from "lucide-react";
import { Input } from "./ui/input";

function MyTaskPage() {
  const [viewMode, setViewMode] = useState("card");
  return (
    <div>
      <Navbar />
      <div className="flex h-screen">
        <Nav />
        <div className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2 ">
              <div className="bg-blue-200 rounded-md p-1">
                <SquareCheckBig className="text-blue-600" size={30} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Tasks</h1>
                <h1 className="text-1xl text-gray-400 font-bold">
                  Manage and track all tasks
                </h1>
              </div>
            </div>

            {/* +++ ADDED VIEW TOGGLE +++ */}
            <div className="flex items-center gap-3">
              <div className="flex border rounded-md gap-2 p-1 bg-blue-100">
                <button
                  onClick={() => setViewMode("card")}
                  className={`p-2 rounded cursor-pointer hover:bg-white ${
                    viewMode === "card" ? "bg-white shadow" : ""
                  }`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded cursor-pointer hover:bg-white  ${
                    viewMode === "list" ? "bg-white shadow " : ""
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <h1 className="text-lg font-bold">Tasks I've Assigned</h1>
          </div>
          <div className="mb-3 flex items-center">
            {/* <Input placeholder="Search your tasks..." className="max-w-6xl" /> */}
            <div className="relative w-full max-w-6xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search your tasks..."
                className="pl-10 py-3 text-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyTaskPage;
