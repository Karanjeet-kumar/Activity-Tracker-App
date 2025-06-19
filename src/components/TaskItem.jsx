import {
  ChevronDown,
  FileText,
  LayoutList,
  MinusCircle,
  PlusCircle,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

const TaskItem = ({ task, level, openTasks, setOpenTasks }) => {
  const isOpen = openTasks?.includes(task.taskId);

  const toggleTask = () => {
    if (isOpen) {
      setOpenTasks(openTasks.filter((id) => id !== task.taskId));
    } else {
      setOpenTasks([...openTasks, task.taskId]);
    }
  };

  return (
    <div
      className={`border rounded-lg overflow-hidden ${level > 0 ? "ml-6" : ""}`}
    >
      <div
        className={`flex items-center justify-between p-4 cursor-pointer 
                   ${isOpen ? "bg-blue-50" : "bg-gray-50"} hover:bg-blue-100`}
        onClick={toggleTask}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center
                         ${
                           task.child_tasks?.length
                             ? "bg-blue-100 text-blue-800"
                             : "bg-gray-200"
                         }`}
          >
            {task.child_tasks?.length ? (
              isOpen ? (
                <MinusCircle className="h-5 w-5" />
              ) : (
                <PlusCircle className="h-5 w-5" />
              )
            ) : (
              <FileText className="h-5 w-5" />
            )}
          </div>
          <div>
            <h4 className="font-semibold"> {task.description}</h4>
            <div className="flex gap-2 mt-1">
              <Badge
                variant={task.status === "Verified" ? "secondary" : "outline"}
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  task.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : task.status === "InProgress"
                    ? "bg-yellow-100 text-yellow-800"
                    : task.status === "Verified"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                Status: {task.status}
              </Badge>
              <Badge variant="secondary">
                {new Date(task.assignedOn).toLocaleDateString()}
              </Badge>
              <Badge variant="secondary">{task.assignedTo}</Badge>
            </div>
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="p-4 space-y-4 bg-white">
          {/* Task Updates */}
          {task.updates?.length > 0 && (
            <div>
              <h5 className="font-medium mb-2 flex items-center gap-2 text-gray-700">
                <RefreshCw className="h-4 w-4" /> Updates
              </h5>
              <div className="space-y-3">
                {task.updates.map((update, i) => (
                  <Card key={i} className="bg-gray-50">
                    <CardContent className="p-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs font-medium text-gray-600">
                            Action
                          </p>
                          <p className="font-medium">{update.actionStatus}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600">
                            By
                          </p>
                          <p>{update.actionBy}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600">
                            Date
                          </p>
                          <p>
                            {new Date(update.actionOn).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-600">
                            Remarks
                          </p>
                          <p>{update.remarks}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Child Tasks */}
          {task.child_tasks?.length > 0 && (
            <div>
              <h5 className="font-medium mb-2 flex items-center gap-2 text-gray-700">
                <LayoutList className="h-4 w-4" /> Assigned Sub-Tasks
              </h5>
              <div className="space-y-3">
                {task.child_tasks.map((childTask) => (
                  <TaskItem
                    key={childTask.taskId}
                    task={childTask}
                    level={level + 1}
                    openTasks={openTasks}
                    setOpenTasks={setOpenTasks}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskItem;
