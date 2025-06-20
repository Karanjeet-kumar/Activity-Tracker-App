import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { History, ListChecks, Loader2, RectangleEllipsis } from "lucide-react";
import { TASK_INFO_API_END_POINT } from "./utils/api_const";
import axios from "axios";
import TaskItem from "./TaskItem";
import { Badge } from "./ui/badge";

// TaskInfo Component
function TaskInfo({ task }) {
  const [showInfoBox, setShowInfoBox] = useState(null);
  const [openTasks, setOpenTasks] = useState([]);

  const [taskData, setTaskData] = useState(null);

  const taskHandler = async (task) => {
    try {
      // API(GET_TASK_INFO_API)--->Connected
      await axios
        .get(`${TASK_INFO_API_END_POINT}/${task.TaskId}/`)
        .then((res) => setTaskData(res.data));
    } catch (error) {
      console.error("Error fetching task data:", error);
      toast.error("Failed to fetch info task.");
    }
  };

  return (
    <div>
      <Dialog
        open={showInfoBox === task.TaskId}
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
                      setShowInfoBox(task.TaskId);
                      taskHandler(task);
                    }}
                  >
                    <RectangleEllipsis size={16} />
                    Info
                    {!!task.SubTaskCount && (
                      <Badge variant="secondary" className="h-3 bg-white">
                        {task.SubTaskCount}
                      </Badge>
                    )}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {task.SubTaskCount ? task.SubTaskCount : "No"} Assigned Task
              </TooltipContent>
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
                {task.TaskDescription}
              </DialogTitle>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="outline">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    TargetDate-{task.TargetDate}
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      task.Status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : task.Status === "InProgress"
                        ? "bg-yellow-100 text-yellow-800"
                        : task.Status === "Verified"
                        ? "bg-orange-100 text-orange-800"
                        : task.Status === "ReOpen"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {task.Status}
                  </span>
                </Badge>
              </div>
            </div>
          </DialogHeader>

          {showInfoBox === task.TaskId && taskData && (
            <div className="bg-white rounded-lg border shadow-sm p-4">
              {!taskData ? (
                <div className="text-center py-8">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
                  <p className="mt-2">Loading task details...</p>
                </div>
              ) : (
                <div>
                  {/* Tasks Section */}
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <ListChecks className="h-5 w-5" /> Task Details
                  </h3>
                  <div className="space-y-4">
                    <TaskItem
                      key={task.taskId}
                      task={taskData}
                      level={0}
                      openTasks={openTasks}
                      setOpenTasks={setOpenTasks}
                    />
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

export default TaskInfo;
