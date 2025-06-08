import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "./shared/Navbar";
import Nav from "./shared/Nav";
import { CalendarDays, ClipboardList, Search } from "lucide-react";
import { useSelector } from "react-redux";
import ActivityForm from "./ActivityForm";
import useLoadActivityPage from "./hooks/useLoadActivityPage";
import { useEffect, useState } from "react";

function ActivityPage() {
  const { loggedUser } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(true);
  const { allTrnActivity, allAssignedActivity } = useSelector(
    (store) => store.activity
  );
  const hasActivities = true; // Replace with actual data check

  useLoadActivityPage();

  useEffect(() => {
    if (loggedUser) {
      setLoading(false);
    }
  }, [loggedUser]);

  if (loading || !loggedUser) {
    return (
      <div>
        <Navbar />
        <div className="flex h-screen">
          <Nav />
          <div className="flex-1 overflow-auto p-6">Loading...</div>
        </div>
      </div>
    );
  }
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
                <ActivityForm />
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
            {/* <Input placeholder="Search activities..." className="max-w-6xl" /> */}
            <div className="relative w-full max-w-6xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search activities..."
                className="pl-10 py-3 text-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
            {loggedUser?.isAdmin ? (
              <>
                {allTrnActivity.map((act) => (
                  <div key={act.ActivityId}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl">
                          {act.Category}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          {act.ActivityName}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <p>Status</p>
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              {act.Status}
                            </span>
                          </div>
                          <div className="text-sm">
                            <p>Due Date</p>
                            <div className="flex items-center text-sm text-gray-600">
                              <CalendarDays className="h-4 w-4 mr-1" />
                              <span>{act.TargetDate}</span>
                            </div>
                          </div>
                        </div>

                        {/* <div>
                      <p className="text-sm font-semibold text-gray-800 mb-1">
                        Description
                      </p>
                      <p className="text-sm text-gray-700">
                        Create project plan with milestones and timelines
                      </p>
                    </div> */}

                        <div>
                          <p className="text-sm font-semibold text-gray-800 mb-1">
                            Description
                          </p>
                          <p className="text-sm text-gray-700">
                            {act.AdditionalNote}
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t">
                          <div>
                            <p className="text-xs text-gray-500">Assigned To</p>
                            <p className="text-sm text-gray-800">
                              {act.AssignedUserRole}-{act.AssignedUser}
                            </p>
                            <p className="text-sm text-gray-800">
                              Dept-{act.Department}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Verifier</p>
                            <p className="text-sm text-gray-800">
                              {act.Verifier}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </>
            ) : (
              <>
                {allAssignedActivity.map((act) => (
                  <div key={act.ActivityId}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl">
                          {act.Category}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          {act.ActivityName}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="flex justify-between items-center">
                          {/* <div className="flex items-center space-x-2">
                            <p>Status</p>
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              {act.Status}
                            </span>
                          </div> */}
                          <div className="text-sm">
                            <p>Due Date</p>
                            <div className="flex items-center text-sm text-gray-600">
                              <CalendarDays className="h-4 w-4 mr-1" />
                              <span>{act.TargetDate}</span>
                            </div>
                          </div>
                        </div>

                        {/* <div>
                      <p className="text-sm font-semibold text-gray-800 mb-1">
                        Description
                      </p>
                      <p className="text-sm text-gray-700">
                        Create project plan with milestones and timelines
                      </p>
                    </div> */}

                        <div>
                          <p className="text-sm font-semibold text-gray-800 mb-1">
                            Description
                          </p>
                          <p className="text-sm text-gray-700">
                            {act.AdditionalNote}
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t">
                          <div>
                            <p className="text-xs text-gray-500">Assigned By</p>
                            <p className="text-sm text-gray-800">
                              {act.CreatedBy}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Verifier</p>
                            <p className="text-sm text-gray-800">
                              {act.Verifier}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </>
            )}
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
              {!!loggedUser?.isAdmin && <ActivityForm />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivityPage;
