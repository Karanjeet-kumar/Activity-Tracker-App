import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { History, ListChecks, Loader2, RectangleEllipsis } from "lucide-react";
import { ACTIVITY_INFO_API_END_POINT } from "./utils/api_const";
import axios from "axios";
import TaskItem from "./TaskItem";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

// ActivityInfo Component
function ActivityInfo({ activity }) {
  const [showInfoBox, setShowInfoBox] = useState(null);
  const [openTasks, setOpenTasks] = useState([]);

  const [activityData, setActivityData] = useState(null);

  const activityHandler = async (activity) => {
    try {
      // API(GET_ACTIVITY_INFO_API)--->Connected
      await axios
        .get(`${ACTIVITY_INFO_API_END_POINT}/${activity.ActivityId}/`)
        .then((res) => setActivityData(res.data));
    } catch (error) {
      console.error("Error fetching activity data:", error);
      toast.error("Failed to fetch info activity.");
    }
  };

  return (
    <div>
      <Dialog
        open={showInfoBox === activity.ActivityId}
        onOpenChange={(isOpen) => {
          if (!isOpen) setShowInfoBox(null);
        }}
      >
        <DialogTrigger asChild>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <span
                    className="text-black flex justify-between items-center gap-2 text-xs px-1.5 py-0.5 rounded border cursor-pointer   bg-gradient-to-r from-gray-400 to-gray-200 border-gray-800"
                    onClick={() => {
                      setShowInfoBox(activity.ActivityId);
                      activityHandler(activity);
                    }}
                  >
                    <RectangleEllipsis size={16} />
                    Info
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Track Activity</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-800">
                {activity.ActivityName}
              </DialogTitle>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="outline">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {activity.Category}
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      activity.Status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : activity.Status === "InProgress"
                        ? "bg-yellow-100 text-yellow-800"
                        : activity.Status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : activity.Status === "Closed" ||
                          activity.Status === "ForeClose"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {activity.Status}
                  </span>
                </Badge>
              </div>
            </div>
          </DialogHeader>

          {showInfoBox === activity.ActivityId && activityData && (
            <div className="bg-white rounded-lg border shadow-sm p-4">
              {!activityData ? (
                <div className="text-center py-8">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
                  <p className="mt-2">Loading activity details...</p>
                </div>
              ) : (
                <div>
                  {/* Activity Updates */}
                  {activityData.activityUpdates?.length > 0 ? (
                    <div className="mb-6">
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <History className="h-5 w-5" /> Verification Status
                      </h3>
                      <div className="space-y-3">
                        {activityData.activityUpdates.map((update, index) => (
                          <Card
                            key={index}
                            className="bg-blue-50 border-blue-100"
                          >
                            <CardContent className="p-4">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-3">
                                  <p className="text-sm font-medium text-gray-600">
                                    Action
                                  </p>
                                  <p className="font-semibold">
                                    {update.actionStatus}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <p className="text-sm font-medium text-gray-600">
                                    By
                                  </p>
                                  <p className="font-semibold">
                                    {update.actionBy}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">
                                    Date
                                  </p>
                                  <p>
                                    {new Date(
                                      update.actionOn
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  {update.comments && (
                                    <div className="col-span-2">
                                      <p className="text-sm font-medium text-gray-600">
                                        Comments
                                      </p>
                                      <p>{update.comments}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <History className="h-5 w-5" /> Verification Status
                      </h3>
                      <div className="space-y-3">
                        <Card className="bg-blue-50 border-blue-100">
                          <CardContent className="p-4 text-center font-medium">
                            {activity.Status === "Rejected" ? (
                              <div>
                                Rejected By User-{activity.AssignedUser}..
                              </div>
                            ) : activity.Status === "ForeClose" ? (
                              <div>Rejected Confirm..</div>
                            ) : activity.Status === "Completed" ? (
                              <div>Verification Not Required</div>
                            ) : (
                              <div>Not Verified Yet..</div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {/* Tasks Section */}
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <ListChecks className="h-5 w-5" /> Task Details
                  </h3>
                  <div className="space-y-4">
                    {activityData.tasks?.map((task) => (
                      <TaskItem
                        key={task.taskId}
                        task={task}
                        level={0}
                        openTasks={openTasks}
                        setOpenTasks={setOpenTasks}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ActivityInfo;
