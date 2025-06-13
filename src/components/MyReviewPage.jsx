import Navbar from "./shared/Navbar";
import Nav from "./shared/Nav";
import { useState } from "react";
import { CopyCheck, LayoutGrid, List, Search } from "lucide-react";
import { Input } from "./ui/input";

function MyReviewPage() {
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
                <CopyCheck className="text-blue-600" size={30} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">My Reviews</h1>
                <h1 className="text-1xl text-gray-400 font-bold">
                  Verify/Reject activities"
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
            <h1 className="text-lg font-bold">Activities I've To Verify</h1>
          </div>
          <div className="mb-3 flex items-center">
            {/* <Input placeholder="Search activities..." className="max-w-6xl" /> */}
            <div className="relative w-full max-w-6xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search activities..."
                className="pl-10 py-3 text-md"
              />
            </div>
          </div>

          {/* +++ RENDER CONDITIONAL VIEW +++ */}
          {/* {renderActivities()} */}
          <div>
            {/* No Activities Section */}
            <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center space-y-4 bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer">
              <div className="bg-blue-100 rounded-full p-4">
                <CopyCheck className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">
                No activities To Verify
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                You don't have any activities to verify
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyReviewPage;
