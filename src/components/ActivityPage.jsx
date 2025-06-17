import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "./shared/Navbar";
import Nav from "./shared/Nav";
import {
  AlarmClockPlus,
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
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useNav } from "./context/NavContext";

function ActivityPage() {
  const { isNavVisible } = useNav();
  const { loggedUser } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(true);
  const [showRejectComment, setShowRejectComment] = useState(null);
  const [rejectComment, setRejectComment] = useState("");
  const { allTrnActivity, allAssignedActivity } = useSelector(
    (store) => store.activity
  );

  // +++ ADDED VIEW STATE +++
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'list'

  // useLoadActivityPage();
  const { refresh } = useLoadActivityPage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      refresh(searchTerm, statusFilter); // pass activityName, status left empty
    }, 500); // adjust debounce time as needed

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, statusFilter, refresh]);

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
          <div className="flex-1 overflow-auto p-6">
            <div className="flex items-center justify-center max-h-[300px] h-[300px]">
              <div className="flex flex-col items-center space-y-3">
                <div className="border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                <p className="text-muted-foreground">Loading activities...</p>
              </div>
            </div>
          </div>
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
          ActionOn: new Date(
            new Date().getTime() - new Date().getTimezoneOffset() * 60000
          )
            .toISOString()
            .slice(0, -1),
        }
      );

      // 2. Create new TrnActivityTask record
      // API(ADD_TRN_TASK_ACTIVITY_API)--->Connected
      await axios.post(ADD_TASK_API, {
        TaskDescription: activity.ActivityName,
        assigned_to: loggedUser.user_id,
        AssignedOn: new Date(
          new Date().getTime() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, -1),
        TargetDate: activity.TargetDate,
        status: 2,
        activity: activity.ActivityId,
        Remarks: activity.AdditionalNote,
      });
      // Optionally refetch activities or update local state
      await refresh();
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
          ActionOn: new Date(
            new Date().getTime() - new Date().getTimezoneOffset() * 60000
          )
            .toISOString()
            .slice(0, -1),
          Comments: comment,
        }
      );
      // Optionally refetch activities or update local state
      await refresh();
      toast.success("Activity rejected!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject activity.");
    }
  };

  const handleClose = async (act) => {
    try {
      // API(CLOSE_ACTIVITY_API)--->Connected
      await axios.put(
        `${TRN_ACTIVITY_API_END_POINT}/close/${act.ActivityId}/`,
        {
          status: 6,
          ClosedOn: new Date(
            new Date().getTime() - new Date().getTimezoneOffset() * 60000
          )
            .toISOString()
            .slice(0, -1),
        }
      );
      // Optionally refetch activities or update local state
      await refresh(searchTerm, statusFilter);
      toast.success("Activity Closed Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to close activity.");
    }
  };

  const handleForeClose = async (act) => {
    try {
      // API(CLOSE_ACTIVITY_API)--->Connected
      await axios.put(
        `${TRN_ACTIVITY_API_END_POINT}/close/${act.ActivityId}/`,
        {
          status: 11,
          ClosedOn: new Date(
            new Date().getTime() - new Date().getTimezoneOffset() * 60000
          )
            .toISOString()
            .slice(0, -1),
        }
      );
      // Optionally refetch activities or update local state
      await refresh(searchTerm, statusFilter);
      toast.success("Activity Closed Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to close activity.");
    }
  };

  // +++ CONDITIONAL RENDERING FOR ACTIVITIES +++
  const renderActivities = () => {
    const activities = loggedUser?.isAdmin
      ? allTrnActivity
      : allAssignedActivity;

    if (activities?.length === 0) {
      return (
        <div>
          {/* No Activities Section */}
          <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center space-y-4 bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer">
            <div className="bg-blue-100 rounded-full p-4">
              {loggedUser?.isAdmin ? (
                <ClipboardList className="h-12 w-12" size={30} />
              ) : (
                <AlarmClockPlus className="h-12 w-12" size={30} />
              )}
            </div>
            <h3 className="text-2xl font-bold tracking-tight">
              {loggedUser?.isAdmin ? "No activities found" : "No tasks found"}
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              {loggedUser?.isAdmin
                ? "Get started by creating a new activity"
                : "You don't have any assigned tasks yet"}
            </p>
            {!!loggedUser?.isAdmin && <ActivityForm />}
          </div>
        </div>
      );
    }

    // Card View
    if (viewMode === "card") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {activities.map((act) => (
            <div
              key={act.ActivityId}
              className=" border border-gray-400 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader className="p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="max-w-[60%]">
                    <CardTitle className="text-base font-medium text-gray-800 line-clamp-1">
                      {act.ActivityName}
                    </CardTitle>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {act.Category}
                    </p>
                  </div>

                  {loggedUser.isAdmin ? (
                    act.Status === "Completed" ? (
                      <Button
                        size="sm"
                        className="h-7 px-2 text-xs bg-gradient-to-r from-green-800 to-green-400 cursor-pointer"
                        onClick={() => {
                          const toastId = toast.success(
                            "Are you sure you want to close this activity?",
                            {
                              description: (
                                <div className="flex justify-end gap-2 mt-2">
                                  <Button
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded cursor-pointer"
                                    onClick={() => {
                                      handleClose(act);
                                      toast.dismiss(toastId);
                                    }}
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    className="border px-3 py-1 text-sm rounded bg-gray-400 hover:bg-gray-600 cursor-pointer"
                                    onClick={() => toast.dismiss(toastId)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ),
                              duration: 10000,
                            }
                          );
                        }}
                      >
                        Close Activity
                      </Button>
                    ) : act.Status === "Rejected" ? (
                      <Button
                        size="sm"
                        className="h-7 px-2 text-xs bg-gradient-to-r from-green-800 to-green-400 cursor-pointer"
                        onClick={() => {
                          const toastId = toast.success(
                            "Are you sure you want to close this activity?",
                            {
                              description: (
                                <div className="flex justify-end gap-2 mt-2">
                                  <Button
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded cursor-pointer"
                                    onClick={() => {
                                      handleForeClose(act);
                                      toast.dismiss(toastId);
                                    }}
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    className="border px-3 py-1 text-sm rounded bg-gray-400 hover:bg-gray-600 cursor-pointer"
                                    onClick={() => toast.dismiss(toastId)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ),
                              duration: 10000,
                            }
                          );
                        }}
                      >
                        ForeClose
                      </Button>
                    ) : null
                  ) : (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700 cursor-pointer"
                        onClick={() => {
                          const toastId = toast.success(
                            "Are you sure you want to accept?",
                            {
                              description: (
                                <div className="flex justify-end gap-2 mt-2">
                                  <Button
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded cursor-pointer"
                                    onClick={() => {
                                      handleAccept(act);
                                      toast.dismiss(toastId);
                                    }}
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    className="border px-3 py-1 text-sm rounded bg-gray-400 hover:bg-gray-600 cursor-pointer"
                                    onClick={() => toast.dismiss(toastId)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ),
                              duration: 10000,
                            }
                          );
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 px-2 text-xs bg-red-600 hover:bg-red-700 cursor-pointer"
                        onClick={() => {
                          setShowRejectComment((prev) =>
                            prev === act.ActivityId ? null : act.ActivityId
                          );
                          setRejectComment("");
                        }}
                      >
                        {showRejectComment === act.ActivityId
                          ? "✕ Cancel"
                          : "Reject"}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Status and Dates */}
                <div className="flex justify-between items-center">
                  {!!loggedUser.isAdmin && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded border ${
                        act.Status === "Completed"
                          ? "bg-gradient-to-r from-green-500 to-green-300 border-green-800 text-green-800"
                          : act.Status === "InProgress"
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-300 border-yellow-800 text-yellow-800"
                          : act.Status === "Rejected"
                          ? "bg-gradient-to-r from-red-500 to-red-300 border-red-800 text-red-800"
                          : "bg-gradient-to-r from-blue-500 to-blue-300 border-blue-800 text-blue-800"
                      }`}
                    >
                      {act.Status}
                    </span>
                  )}
                  <div>
                    <p className=" text-xs font-medium text-gray-700 mb-0.5">
                      Target Date
                    </p>
                    <div className="text-xs text-gray-500 flex items-center">
                      <CalendarDays className="h-3.5 w-3.5 mr-1" />
                      {act.TargetDate}
                    </div>
                  </div>
                </div>

                {/* Reject Comment Section */}
                {showRejectComment === act.ActivityId && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-md border border-gray-200">
                    <div className="space-y-2">
                      <textarea
                        value={rejectComment}
                        onChange={(e) => setRejectComment(e.target.value)}
                        placeholder="Reason for rejection..."
                        className="w-full p-1.5 text-xs border rounded focus:ring focus:ring-red-100 min-h-[60px]"
                      />
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          className="h-7 px-3 text-xs bg-red-600 hover:bg-red-700 cursor-pointer"
                          onClick={() => {
                            if (rejectComment === "") {
                              toast.error("Enter the reason to proceed...");
                            } else {
                              const toastId = toast.error(
                                "Are you sure you want to reject?",
                                {
                                  description: (
                                    <div className="flex justify-end gap-2 mt-2">
                                      <Button
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded cursor-pointer"
                                        onClick={() => {
                                          handleReject(act, rejectComment);
                                          setRejectComment("");
                                          setShowRejectComment(null);
                                          toast.dismiss(toastId);
                                        }}
                                      >
                                        Confirm
                                      </Button>
                                      <Button
                                        className="border px-3 py-1 text-sm rounded bg-gray-400 hover:bg-gray-600 cursor-pointer"
                                        onClick={() => toast.dismiss(toastId)}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  ),
                                  duration: 10000,
                                }
                              );
                            }
                          }}
                        >
                          Confirm
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-3 pt-0 space-y-2">
                <div className="text-xs">
                  <p className="font-medium text-gray-700 mb-0.5">
                    Description:
                  </p>
                  <p className="text-gray-600 line-clamp-3">
                    {act.AdditionalNote}
                  </p>
                </div>

                <div
                  className={` rounded-2xl flex justify-between text-xs p-2 border ${
                    act.Status === "Completed"
                      ? "bg-gradient-to-r from-green-500 to-green-300 border-green-800"
                      : act.Status === "InProgress"
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-300 border-yellow-800"
                      : act.Status === "Rejected"
                      ? "bg-gradient-to-r from-red-500 to-red-300 border-red-800"
                      : "bg-gradient-to-r from-blue-500 to-blue-300 border-blue-800"
                  }`}
                >
                  <div>
                    <p className="text-gray-500">Assigned On:</p>
                    <p className="text-gray-700">
                      {act.CreatedOn.split("T")[0]}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">
                      {loggedUser.isAdmin ? "Assigned To:" : "Assigned By:"}
                    </p>
                    {loggedUser.isAdmin ? (
                      <>
                        <p className="text-gray-700 truncate max-w-[100px]">
                          {act.AssignedUser}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-700 truncate max-w-[100px]">
                        {act.CreatedBy}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-gray-500">Verifier:</p>
                    <p className="text-gray-700">{act.Verifier}</p>
                  </div>
                </div>

                {!!loggedUser.isAdmin && (
                  <div className="rounded-2xl flex justify-around items-center text-xs p-2 bg-gradient-to-r from-cyan-500 to-cyan-300 border border-cyan-800 ">
                    <p className="text-gray-700 ">
                      Assigned User-{act.AssignedUserRole}
                    </p>
                    <p className="text-gray-700 ">
                      Department-{act.Department}
                    </p>
                  </div>
                )}
              </CardContent>
            </div>
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
                Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              {!!loggedUser.isAdmin && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned On
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target Date
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
              <th className="px-7 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                Perform Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activities.map((act) => (
              <tr key={act.ActivityId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {act.ActivityName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {act.Category}
                </td>
                {!!loggedUser.isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded border ${
                        act.Status === "Completed"
                          ? "bg-gradient-to-r from-green-500 to-green-300 border-green-800 text-green-800"
                          : act.Status === "InProgress"
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-300 border-yellow-800 text-yellow-800"
                          : act.Status === "Rejected"
                          ? "bg-gradient-to-r from-red-500 to-red-300 border-red-800 text-red-800"
                          : "bg-gradient-to-r from-blue-500 to-blue-300 border-blue-800 text-blue-800"
                      }`}
                    >
                      {act.Status}
                    </span>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    <span>{act.CreatedOn.split("T")[0]}</span>
                  </div>
                </td>
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
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
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
                {loggedUser.isAdmin ? (
                  act.Status === "Completed" ? (
                    <td className="px-7 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button
                        size="sm"
                        className="h-7 px-2 text-xs bg-gradient-to-r from-green-800 to-green-400 cursor-pointer"
                        onClick={() => {
                          const toastId = toast.success(
                            "Are you sure you want to close this activity?",
                            {
                              description: (
                                <div className="flex justify-end gap-2 mt-2">
                                  <Button
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded cursor-pointer"
                                    onClick={() => {
                                      handleClose(act);
                                      toast.dismiss(toastId);
                                    }}
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    className="border px-3 py-1 text-sm rounded bg-gray-400 hover:bg-gray-600 cursor-pointer"
                                    onClick={() => toast.dismiss(toastId)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ),
                              duration: 10000,
                            }
                          );
                        }}
                      >
                        Close Activity
                      </Button>
                    </td>
                  ) : act.Status === "Rejected" ? (
                    <td className="px-7 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button
                        size="sm"
                        className="h-7 px-2 text-xs bg-gradient-to-r from-green-800 to-green-400 cursor-pointer"
                        onClick={() => {
                          const toastId = toast.success(
                            "Are you sure you want to close this activity?",
                            {
                              description: (
                                <div className="flex justify-end gap-2 mt-2">
                                  <Button
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded cursor-pointer"
                                    onClick={() => {
                                      handleForeClose(act);
                                      toast.dismiss(toastId);
                                    }}
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    className="border px-3 py-1 text-sm rounded bg-gray-400 hover:bg-gray-600 cursor-pointer"
                                    onClick={() => toast.dismiss(toastId)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ),
                              duration: 10000,
                            }
                          );
                        }}
                      >
                        ForeClose
                      </Button>
                    </td>
                  ) : null
                ) : (
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700 cursor-pointer"
                        onClick={() => {
                          const toastId = toast.success(
                            "Are you sure you want to accept?",
                            {
                              description: (
                                <div className="flex justify-end gap-2 mt-2">
                                  <Button
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded cursor-pointer"
                                    onClick={() => {
                                      handleAccept(act);
                                      toast.dismiss(toastId);
                                    }}
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    className="border px-3 py-1 text-sm rounded bg-gray-400 hover:bg-gray-600 cursor-pointer"
                                    onClick={() => toast.dismiss(toastId)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ),
                              duration: 10000,
                            }
                          );
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 px-2 text-xs bg-red-600 hover:bg-red-700 cursor-pointer"
                        onClick={() => {
                          setShowRejectComment((prev) =>
                            prev === act.ActivityId ? null : act.ActivityId
                          );
                          setRejectComment("");
                        }}
                      >
                        {showRejectComment === act.ActivityId
                          ? "✕ Cancel"
                          : "Reject"}
                      </Button>
                    </div>
                    {/* Reject Comment Section */}
                    {showRejectComment === act.ActivityId && (
                      <div className="mt-3 space-y-2">
                        <Textarea
                          value={rejectComment}
                          onChange={(e) => setRejectComment(e.target.value)}
                          placeholder="Enter reason for rejection..."
                          className="w-full p-2 border rounded-md focus:ring focus:ring-red-200 focus:border-red-500 min-h-[80px]"
                        />
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            className="h-7 px-2 text-xs bg-red-600 hover:bg-red-700 cursor-pointer"
                            onClick={() => {
                              if (rejectComment === "") {
                                toast.error("Enter the reason to proceed...");
                              } else {
                                const toastId = toast.error(
                                  "Are you sure you want to reject?",
                                  {
                                    description: (
                                      <div className="flex justify-end gap-2 mt-2">
                                        <Button
                                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded cursor-pointer"
                                          onClick={() => {
                                            handleReject(act, rejectComment);
                                            setRejectComment("");
                                            setShowRejectComment(null);
                                            toast.dismiss(toastId);
                                          }}
                                        >
                                          Confirm
                                        </Button>
                                        <Button
                                          className="border px-3 py-1 text-sm rounded bg-gray-400 hover:bg-gray-600 cursor-pointer"
                                          onClick={() => toast.dismiss(toastId)}
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    ),
                                    duration: 10000,
                                  }
                                );
                              }
                            }}
                          >
                            Confirm
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
        <div
          className={`flex-1 overflow-auto p-6 h-[calc(100vh-4rem)] transition-all duration-300 ${
            isNavVisible ? "ml-64" : "ml-0"
          }`}
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2 ">
              <div className="bg-blue-200 rounded-md p-1">
                {loggedUser?.isAdmin ? (
                  <ClipboardList className="text-blue-600" size={30} />
                ) : (
                  <AlarmClockPlus className="text-blue-600" size={30} />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {loggedUser?.isAdmin ? "Activities" : "New Tasks"}
                </h1>
                <h1 className="text-1xl text-gray-400 font-bold">
                  {loggedUser?.isAdmin
                    ? "Manage and track all activities"
                    : "Accept/Reject tasks"}
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
              {!!loggedUser.isAdmin && (
                <ActivityForm onActivityCreated={refresh} />
              )}
            </div>
          </div>

          {/* Status Filter Tabs */}
          {!!loggedUser?.isAdmin && (
            <div className="mb-6">
              <Tabs
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                }}
              >
                <TabsList className="grid grid-cols-7 w-full gap-2 bg-cyan-300">
                  <TabsTrigger
                    value=""
                    className="bg-white hover:bg-orange-200 data-[state=active]:bg-orange-400"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="1"
                    className="bg-white hover:bg-blue-200 data-[state=active]:bg-blue-400"
                  >
                    New
                  </TabsTrigger>
                  <TabsTrigger
                    value="3"
                    className="bg-white hover:bg-yellow-200 data-[state=active]:bg-yellow-400"
                  >
                    In Progress
                  </TabsTrigger>
                  <TabsTrigger
                    value="7"
                    className="bg-white hover:bg-red-200 data-[state=active]:bg-red-400"
                  >
                    Rejected
                  </TabsTrigger>
                  <TabsTrigger
                    value="5"
                    className="bg-white hover:bg-green-200 data-[state=active]:bg-green-400"
                  >
                    Completed
                  </TabsTrigger>
                  <TabsTrigger
                    value="6"
                    className="bg-white hover:bg-orange-200 data-[state=active]:bg-orange-400"
                  >
                    Closed
                  </TabsTrigger>
                  <TabsTrigger
                    value="11"
                    className="bg-white hover:bg-orange-200 data-[state=active]:bg-orange-400"
                  >
                    ForeClosed
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          <div className="mb-2">
            <h1 className="text-lg font-bold">
              {loggedUser?.isAdmin
                ? "Activities I've Created"
                : "Tasks Assigned To Me"}
            </h1>
          </div>
          <div className="mb-3 flex items-center">
            {/* <Input placeholder="Search activities..." className="max-w-6xl" /> */}
            <div className="relative w-full max-w-6xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks/activities..."
                className="pl-10 py-3 text-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* +++ RENDER CONDITIONAL VIEW +++ */}
          {renderActivities()}
        </div>
      </div>
    </div>
  );
}

export default ActivityPage;
