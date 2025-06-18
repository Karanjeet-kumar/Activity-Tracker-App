import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarDays, RectangleEllipsis } from "lucide-react";

// ActivityInfo Component
function ActivityInfo({ activity }) {
  const [showInfoBox, setShowInfoBox] = useState(null);
  const [openTask, setOpenTask] = useState(null);

  const activityData = {
    activityId: 51,
    activityName: "Sample Activity",
    tasks: [
      {
        taskId: 1,
        statusId: 2,
        description: "Do something",
        assignedOn: "2025-06-10",
        assignedTo: "John",
        updates: [
          {
            actionStatus: "Started",
            remarks: "Initial phase",
            actionBy: "John",
            actionOn: "2025-06-11",
          },
          {
            actionStatus: "In Progress",
            remarks: "Working",
            actionBy: "John",
            actionOn: "2025-06-12",
          },
        ],
      },
    ],
  };

  return (
    <Dialog
      open={showInfoBox === activity.ActivityId}
      onOpenChange={(isOpen) => {
        if (!isOpen) setShowInfoBox(null);
      }}
    >
      <DialogTrigger asChild>
        <span
          className={`text-white flex justify-between items-center gap-2 text-xs px-1.5 py-0.5 rounded border cursor-pointer ${
            activity.Status === "Completed"
              ? "bg-gradient-to-r from-green-800 to-green-400 border-green-800 "
              : activity.Status === "InProgress"
              ? "bg-gradient-to-r from-yellow-800 to-yellow-400 border-yellow-800 "
              : activity.Status === "Rejected"
              ? "bg-gradient-to-r from-red-800 to-red-400 border-red-800 "
              : "bg-gradient-to-r from-blue-800 to-blue-400 border-blue-800 "
          }`}
          onClick={() => {
            setShowInfoBox(activity.ActivityId);
          }}
        >
          <RectangleEllipsis size={16} />
          Info
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{activity.ActivityName}</DialogTitle>
          <div className="flex flex-wrap gap-2 pt-2">
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
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {activity.Status}
            </span>
          </div>
        </DialogHeader>

        <div>
          {activityData.tasks.map((task, index) => (
            <div key={index} className="border rounded mb-4">
              <div
                className="cursor-pointer bg-gray-100 p-3 font-semibold"
                onClick={() => setOpenTask(openTask === index ? null : index)}
              >
                Task #{task.taskId} - {task.description}
              </div>
              {openTask === index && (
                <div className="p-4 space-y-2">
                  <p>Status: {task.statusId}</p>
                  <p>
                    Assigned On:{" "}
                    {new Date(task.assignedOn).toLocaleDateString()}
                  </p>
                  <p>Assigned To: {task.assignedTo}</p>

                  <div className="mt-3 border-t pt-3">
                    <h4 className="font-semibold">Updates:</h4>
                    {task.updates.map((update, i) => (
                      <div key={i} className="border p-2 mb-2 bg-gray-50">
                        <p>
                          <strong>Action:</strong> {update.actionStatus}
                        </p>
                        <p>
                          <strong>Remarks:</strong> {update.remarks}
                        </p>
                        <p>
                          <strong>By:</strong> {update.actionBy}
                        </p>
                        <p>
                          <strong>On:</strong>{" "}
                          {new Date(update.actionOn).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ActivityInfo;
