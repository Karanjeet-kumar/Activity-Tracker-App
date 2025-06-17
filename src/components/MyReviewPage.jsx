import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "./shared/Navbar";
import Nav from "./shared/Nav";
import {
  CalendarDays,
  CopyCheck,
  LayoutGrid,
  List,
  Search,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import useGetAllVerifierActivities from "./hooks/useGetAllVerifierActivities";
import { useNav } from "./context/NavContext";
import { ADD_ACTIVITY_UPDATE_API } from "./utils/api_const";
import axios from "axios";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";

function MyReviewPage() {
  const { isNavVisible } = useNav();
  const { loggedUser } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(true);
  const [showReturnComment, setShowReturnComment] = useState(null);
  const [returnComment, setReturnComment] = useState("");
  const { allVerifierActivity } = useSelector((store) => store.activity);

  // +++ ADDED VIEW STATE +++
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'list'

  // useLoadVerifierPage();
  const { refresh } = useGetAllVerifierActivities();

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

  const handleVerify = async (activity) => {
    try {
      // API(ADD_TRN_ACTIVITY_UPDATE_API)--->Connected
      await axios.post(ADD_ACTIVITY_UPDATE_API, {
        activity_id: activity.ActivityId,
        action_by: loggedUser.user_id,
        ActionOn: new Date(
          new Date().getTime() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, -1),
        action_status: 8,
      });
      // Optionally refetch activities or update local state
      await refresh();
      toast.success("Activity Verified Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to verify activity.");
    }
  };

  const handleReturn = async (activity, comment) => {
    // API(ADD_ACTIVITY_UPDATE_API)--->Connected
    try {
      await axios.post(ADD_ACTIVITY_UPDATE_API, {
        activity_id: activity.ActivityId,
        action_by: loggedUser.user_id,
        ActionOn: new Date(
          new Date().getTime() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, -1),
        action_status: 9,
        Comments: returnComment,
      });
      // Optionally refetch activities or update local state
      await refresh();
      toast.success("Activity returned!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to return activity.");
    }
  };

  // +++ CONDITIONAL RENDERING FOR ACTIVITIES +++
  const renderActivities = () => {
    if (allVerifierActivity?.length === 0) {
      return (
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
      );
    }

    // Card View
    if (viewMode === "card") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {allVerifierActivity.map((act) => (
            <div
              key={act.ActivityId}
              className="border border-gray-400 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader className="p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="max-w-[60%]">
                    <CardTitle className="text-base font-medium text-gray-800 line-clamp-1">
                      {act.ActivityName}
                    </CardTitle>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {act.CategoryName}
                    </p>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      // onClick={() => {
                      //   toast.success("Are you sure you want to verify?", {
                      //     action: {
                      //       label: "Confirm",
                      //       onClick: () => handleVerify(act),
                      //     },
                      //   });
                      // }}
                      onClick={() => {
                        const toastId = toast.success(
                          "Are you sure you want to verify?",
                          {
                            description: (
                              <div className="flex justify-end gap-2 mt-2">
                                <Button
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded cursor-pointer"
                                  onClick={() => {
                                    handleVerify(act);
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
                      disabled={act.task_status === "Verified"}
                    >
                      Verify
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 px-2 text-xs bg-red-600 hover:bg-red-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        setShowReturnComment((prev) =>
                          prev === act.ActivityId ? null : act.ActivityId
                        );
                        setReturnComment("");
                      }}
                      disabled={act.task_status === "Verified"}
                    >
                      {showReturnComment === act.ActivityId
                        ? "✕ Cancel"
                        : "Return"}
                    </Button>
                  </div>
                </div>

                {/* Status and Dates */}
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded border ${
                      act.task_status === "Verified"
                        ? "bg-gradient-to-r from-green-500 to-green-300 border-green-800 text-green-800"
                        : "bg-gradient-to-r from-yellow-500 to-yellow-300 border-yellow-800 text-yellow-800"
                    }`}
                  >
                    {act.task_status === "Completed"
                      ? "Pending"
                      : act.task_status}
                  </span>
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

                {/* Return Comment Section */}
                {showReturnComment === act.ActivityId && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-md border border-gray-200">
                    <div className="space-y-2">
                      <textarea
                        value={returnComment}
                        onChange={(e) => setReturnComment(e.target.value)}
                        placeholder="Reason for return..."
                        className="w-full p-1.5 text-xs border rounded focus:ring focus:ring-red-100 min-h-[60px]"
                      />
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          className="h-7 px-3 text-xs bg-red-600 hover:bg-red-700 cursor-pointer"
                          onClick={() => {
                            if (returnComment === "") {
                              toast.error("Enter the reason to proceed...");
                            } else {
                              const toastId = toast.error(
                                "Are you sure you want to return?",
                                {
                                  description: (
                                    <div className="flex justify-end gap-2 mt-2">
                                      <Button
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded cursor-pointer"
                                        onClick={() => {
                                          handleReturn(act, returnComment);
                                          setReturnComment("");
                                          setShowReturnComment(null);
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
                    {act.Description}
                  </p>
                </div>

                <div
                  className={` rounded-2xl flex justify-between text-xs p-2 border ${
                    act.task_status === "Verified"
                      ? "bg-gradient-to-r from-green-500 to-green-300 border-green-800 "
                      : "bg-gradient-to-r from-yellow-500 to-yellow-300 border-yellow-800 "
                  }`}
                >
                  <div>
                    <p className="text-gray-500">Assigned On:</p>
                    <p className="text-gray-700">
                      {act.CreatedOn.split("T")[0]}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Assigned By:</p>
                    <p className="text-gray-700 truncate max-w-[100px]">
                      {act.AssignedBy}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Assigned To:</p>
                    <p className="text-gray-700 truncate max-w-[100px]">
                      {act.AssignedTo}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl flex justify-around items-center text-xs p-2 bg-gradient-to-r from-cyan-500 to-cyan-300 border border-cyan-800 ">
                  <p className="text-gray-700 ">
                    Assigned User-{act.AssignedUserRole}
                  </p>
                  <p className="text-gray-700 ">
                    Department-{act.AssignedUserDept}
                  </p>
                </div>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned On
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned By
              </th>
              <th className="px-7 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                Perform Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allVerifierActivity.map((act) => (
              <tr key={act.ActivityId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {act.ActivityName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {act.CategoryName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded border ${
                      act.task_status === "Verified"
                        ? "bg-gradient-to-r from-green-500 to-green-300 border-green-800 text-green-800"
                        : "bg-gradient-to-r from-yellow-500 to-yellow-300 border-yellow-800 text-yellow-800"
                    }`}
                  >
                    {act.task_status === "Completed"
                      ? "Pending"
                      : act.task_status}
                  </span>
                </td>
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
                  {act.Description}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {act.AssignedUserRole}-{act.AssignedTo}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {act.AssignedUserDept}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {act.AssignedBy}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700 cursor-pointer"
                      onClick={() => {
                        const toastId = toast.success(
                          "Are you sure you want to verify?",
                          {
                            description: (
                              <div className="flex justify-end gap-2 mt-2">
                                <Button
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded cursor-pointer"
                                  onClick={() => {
                                    handleVerify(act);
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
                      disabled={act.task_status === "Verified"}
                    >
                      Verify
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 px-2 text-xs bg-red-600 hover:bg-red-700 cursor-pointer"
                      onClick={() => {
                        setShowReturnComment((prev) =>
                          prev === act.ActivityId ? null : act.ActivityId
                        );
                        setReturnComment("");
                      }}
                      disabled={act.task_status === "Verified"}
                    >
                      {showReturnComment === act.ActivityId
                        ? "✕ Cancel"
                        : "Return"}
                    </Button>
                  </div>

                  {/* Return Comment Section */}
                  {showReturnComment === act.ActivityId && (
                    <div className="mt-3 space-y-2">
                      <Textarea
                        value={returnComment}
                        onChange={(e) => setReturnComment(e.target.value)}
                        placeholder="Enter reason for return..."
                        className="w-full p-2 border rounded-md focus:ring focus:ring-red-200 focus:border-red-500 min-h-[80px]"
                      />
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          className="h-7 px-2 text-xs bg-red-600 hover:bg-red-700 cursor-pointer"
                          onClick={() => {
                            if (returnComment === "") {
                              toast.error("Enter the reason to proceed...");
                            } else {
                              const toastId = toast.error(
                                "Are you sure you want to return?",
                                {
                                  description: (
                                    <div className="flex justify-end gap-2 mt-2">
                                      <Button
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded cursor-pointer"
                                        onClick={() => {
                                          handleReturn(act, returnComment);
                                          setReturnComment("");
                                          setShowReturnComment(null);
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
                <CopyCheck className="text-blue-600" size={30} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Reviews</h1>
                <h1 className="text-1xl text-gray-400 font-bold">
                  Verify/Return activities
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
          {renderActivities()}
        </div>
      </div>
    </div>
  );
}

export default MyReviewPage;
