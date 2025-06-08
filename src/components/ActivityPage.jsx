import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "./shared/Navbar";
import Nav from "./shared/Nav";
import { ClipboardList, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";

function ActivityPage() {
  const { loggedUser } = useSelector((store) => store.auth);
  const hasActivities = false; // Replace with actual data check

  return (
    <div>
      <Navbar />
      <div className="flex h-screen">
        <Nav />
        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2 ">
              <div className="bg-blue-200 rounded-md p-1">
                <ClipboardList className="text-blue-600" size={30} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {loggedUser?.isAdmin ? "Activities" : "My Activities"}
                </h1>
                <h1 className="text-1xl text-gray-400 font-bold">
                  {loggedUser?.isAdmin
                    ? "Manage and track all activities"
                    : "Accept/Reject activities"}
                </h1>
              </div>
            </div>
            {!!loggedUser?.isAdmin && (
              <div>
                <Button>Create Activity</Button>
              </div>
            )}
          </div>

          <div className="mb-2">
            <h1 className="text-lg font-bold">
              {loggedUser?.isAdmin
                ? "Activities I've Created"
                : "Activities Assigned To Me"}
            </h1>
          </div>
          <div className="mb-3 flex items-center">
            <div className="relative w-full max-w-6xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search activities..."
                className="pl-10 py-3 text-md"
              />
            </div>
          </div>

          {/* No Activities Section */}
          {!hasActivities && (
            <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center space-y-4 bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer">
              <div className="bg-blue-100 rounded-full p-4">
                <ClipboardList className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">
                No activities found
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                {loggedUser?.isAdmin
                  ? "Get started by creating a new activity"
                  : "You don't have any assigned activities yet"}
              </p>
              {!!loggedUser?.isAdmin && (
                <Button className="mt-4">Create Activity</Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivityPage;
