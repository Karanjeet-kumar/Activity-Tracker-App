import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "./shared/Navbar";
import Nav from "./shared/Nav";
import {
  CalendarDays,
  ClipboardList,
  LayoutGrid,
  List,
  Search,
} from "lucide-react";
import ActivityForm from "./ActivityForm";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import useLoadActivityPage from "./hooks/useLoadActivityPage";
import { ADD_TASK_API, TRN_ACTIVITY_API_END_POINT } from "./utils/api_const";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";

function ActivityPage() {
  const { loggedUser } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(true);
  const [showRejectComment, setShowRejectComment] = useState(null);
  const [rejectComment, setRejectComment] = useState("");
  const { allTrnActivity, allAssignedActivity } = useSelector(
    (store) => store.activity
  );
  const hasActivities = true; // Replace with actual data check

  // +++ ADDED VIEW STATE +++
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'list'

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

  const handleAccept = async (activity) => {
    try {
      // 1. Update Acceptance field in TrnActivity
      // API(UPDATE_TRN_ACTIVITY_API)--->Connected
      await axios.put(
        `${TRN_ACTIVITY_API_END_POINT}/update/${activity.ActivityId}/`,
        {
          Acceptance: "Yes",
          ActionBy: loggedUser.user_id,
        }
      );

      // 2. Create new TrnActivityTask record
      await axios.post(ADD_TASK_API, {
        TaskDescription: activity.ActivityName,
        assigned_to: loggedUser.user_id,
        AssignedOn: new Date().toISOString().split("T")[0],
        TargetDate: activity.TargetDate,
        status: 2,
        activity: activity.ActivityId,
        Remarks: activity.AdditionalNote,
      });
      // Optionally refetch activities or update local state
      toast.success("Activity Accepted !Go to MyTasks!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept activity.");
    }
  };

  const handleReject = async (activity, comment) => {
    // API(UPDATE_TRN_ACTIVITY_API)--->Connected
    try {
      const res = await axios.put(
        `${TRN_ACTIVITY_API_END_POINT}/update/${activity.ActivityId}/`,
        {
          Acceptance: "No",
          ActionBy: loggedUser.user_id,
          Comments: comment,
        }
      );
      // Optionally refetch activities or update local state
      toast.success("Activity rejected!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject activity.");
    }
  };

  // +++ CONDITIONAL RENDERING FOR ACTIVITIES +++
  const renderActivities = () => {
    const activities = loggedUser.isAdmin
      ? allTrnActivity
      : allAssignedActivity;

    // Card View
    if (viewMode === "card") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
          {activities.map((act) => (
            <Card key={act.ActivityId}>
              <CardHeader>
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{act.Category}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {act.ActivityName}
                      </p>
                    </div>
                    {!loggedUser.isAdmin && (
                      <div className="flex gap-2">
                        <Button
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded cursor-pointer"
                          onClick={() => handleAccept(act)}
                        >
                          Accept
                        </Button>
                        <Button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                          onClick={() =>
                            setShowRejectComment((prev) =>
                              prev === act.ActivityId ? null : act.ActivityId
                            )
                          }
                        >
                          {showRejectComment === act.ActivityId
                            ? "Cancel"
                            : "Reject"}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Reject Comment Section */}
                  {showRejectComment === act.ActivityId && (
                    <div className="mt-3 space-y-2">
                      <textarea
                        value={rejectComment}
                        onChange={(e) => setRejectComment(e.target.value)}
                        placeholder="Enter reason for rejection..."
                        className="w-full p-2 border rounded-md focus:ring focus:ring-red-200 focus:border-red-500 min-h-[80px]"
                      />
                      <div className="flex justify-end">
                        <Button
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded cursor-pointer"
                          onClick={() => {
                            handleReject(act, rejectComment);
                            setRejectComment("");
                            setShowRejectComment(null);
                          }}
                        >
                          Confirm Reject
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="flex justify-between items-center">
                  {/* Status only shown for admin */}
                  {!!loggedUser.isAdmin && (
                    <div className="flex items-center space-x-2">
                      <p>Status</p>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {act.Status}
                      </span>
                    </div>
                  )}

                  <div className="text-sm">
                    <p>Due Date</p>
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      <span>{act.TargetDate}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">
                    Description
                  </p>
                  <p className="text-sm text-gray-700">{act.AdditionalNote}</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <div>
                    <p className="text-xs text-gray-500">
                      {loggedUser.isAdmin ? "Assigned To" : "Assigned By"}
                    </p>
                    {loggedUser.isAdmin ? (
                      <>
                        <p className="text-sm text-gray-800">
                          {act.AssignedUserRole}-{act.AssignedUser}
                        </p>
                        <p className="text-sm text-gray-800">
                          Dept-{act.Department}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-800">{act.CreatedBy}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Verifier</p>
                    <p className="text-sm text-gray-800">{act.Verifier}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    // List View
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activity
              </th>
              {!!loggedUser.isAdmin && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              {loggedUser.isAdmin ? (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                </>
              ) : (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned By
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verifier
              </th>
              {!loggedUser.isAdmin && (
                <th className="px-7 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                  Perform Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activities.map((act) => (
              <tr key={act.ActivityId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {act.Category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {act.ActivityName}
                </td>
                {!!loggedUser.isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {act.Status}
                    </span>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    <span>{act.TargetDate}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {act.AdditionalNote}
                </td>
                {loggedUser.isAdmin ? (
                  <>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {act.AssignedUserRole}-{act.AssignedUser}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {act.Department}
                    </td>
                  </>
                ) : (
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {act.CreatedBy}
                  </td>
                )}
                <td className="px-6 py-4 text-sm text-gray-500">
                  {act.Verifier}
                </td>
                {!loggedUser.isAdmin && (
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <Button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded cursor-pointer"
                        onClick={() => handleAccept(act)}
                      >
                        Accept
                      </Button>
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                        onClick={() =>
                          setShowRejectComment((prev) =>
                            prev === act.ActivityId ? null : act.ActivityId
                          )
                        }
                      >
                        {showRejectComment === act.ActivityId
                          ? "Cancel"
                          : "Reject"}
                      </Button>
                    </div>
                    {/* Reject Comment Section */}
                    {showRejectComment === act.ActivityId && (
                      <div className="mt-3 space-y-2">
                        <textarea
                          value={rejectComment}
                          onChange={(e) => setRejectComment(e.target.value)}
                          placeholder="Enter reason for rejection..."
                          className="w-full p-2 border rounded-md focus:ring focus:ring-red-200 focus:border-red-500 min-h-[80px]"
                        />
                        <div className="flex justify-end">
                          <Button
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded cursor-pointer"
                            onClick={() => {
                              handleReject(act, rejectComment);
                              setRejectComment("");
                              setShowRejectComment(null);
                            }}
                          >
                            Confirm Reject
                          </Button>
                        </div>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="flex h-screen">
        <Nav />
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
              {!!loggedUser.isAdmin && <ActivityForm />}
            </div>
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

          {/* +++ RENDER CONDITIONAL VIEW +++ */}
          {renderActivities()}

          {/* No Activities Section
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
          )} */}
        </div>
      </div>
    </div>
  );
}

export default ActivityPage;
