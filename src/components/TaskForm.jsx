import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog"; // Adjust import path as needed
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTaskName,
  setTaskDesc,
  setAllUsers,
  setAssignedUser,
  setTargetDate,
} from "./redux/taskformSlice";
import { ADD_TASK_API, USER_API_END_POINT } from "./utils/api_const";
import axios from "axios";
import { toast } from "sonner";

const TaskForm = ({ task }) => {
  const { loggedUser } = useSelector((store) => store.auth);
  const [showAssignBox, setShowAssignBox] = useState(null);
  const [step, setStep] = useState("task");
  const { taskName, taskDesc, allUsers, assignedUser, targetDate } =
    useSelector((store) => store.taskForm);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (!showAssignBox) {
      setStep("task");
      setSearchTerm("");
      dispatch(setTaskName(""));
      dispatch(setTaskDesc(""));
      dispatch(setAllUsers([]));
      dispatch(setAssignedUser(""));
      dispatch(setTargetDate(""));
    }
  }, [showAssignBox]);

  useEffect(() => {
    if (step === "user") {
      handleUsers(
        `${loggedUser.locationId}`,
        "EMPLOYEE",
        searchTerm,
        `${loggedUser.deptName}`
      );
    }
  }, [searchTerm]);

  const handleUsers = async (
    locationId,
    userRole,
    userName,
    departmentName
  ) => {
    // API(USERS_API)--->Connected
    // setLoading(true);
    try {
      const params = new URLSearchParams();

      if (userName) params.append("user_name", userName); // matches user_name
      if (userRole) params.append("user_role", userRole); // "HOD" or "EMPLOYEE"
      if (departmentName && departmentName !== "all") {
        params.append("department_name", departmentName);
      }

      const response = await axios.get(
        `${USER_API_END_POINT}/${locationId}/?${params.toString()}`
      );
      dispatch(setAllUsers(response.data.users)); // assuming your API returns user list directly (not inside `users`)
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
    }
  };

  const handleAssign = async (task) => {
    try {
      // Create new TrnActivityTask record
      await axios.post(ADD_TASK_API, {
        TaskDescription: taskName,
        assigned_to: assignedUser.user_id,
        AssignedOn: new Date().toISOString().split("T")[0],
        // AssignedOn: new Date(
        //   new Date().getTime() - new Date().getTimezoneOffset() * 60000
        // )
        //   .toISOString()
        //   .slice(0, -1),
        TargetDate: targetDate,
        status: 2,
        activity: task.ActivityId,
        Remarks: taskDesc,
        IsPrimary: "False",
        reference_task: task.TaskId,
      });
      // Optionally refetch activities or update local state
      toast.success("Task Assigned Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign task.");
    }
  };

  return (
    <Dialog
      open={showAssignBox === task.TaskId}
      onOpenChange={(isOpen) => {
        if (!isOpen) setShowAssignBox(null);
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
          onClick={() => {
            setShowAssignBox(task.TaskId);
          }}
        >
          Assign
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {step !== "task" && (
          <Button
            variant="ghost"
            onClick={() => {
              if (step === "user") setStep("task");
            }}
            className="border border-black bg-blue-300 hover:bg-blue-500 cursor-pointer absolute left-6 top-4 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>
        )}
        <DialogHeader>
          <DialogTitle className="text-center">Assign Task</DialogTitle>
          <DialogDescription className="text-center">
            Assign tasks to users of your department
          </DialogDescription>
        </DialogHeader>

        {step === "task" && (
          <div className=" mt-2 space-y-3">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Task Name</Label>
                <Input
                  placeholder="Enter task name"
                  value={taskName}
                  onChange={(e) => dispatch(setTaskName(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Task Description</Label>
                <Textarea
                  placeholder="Enter task description"
                  value={taskDesc}
                  onChange={(e) => dispatch(setTaskDesc(e.target.value))}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  onClick={() => setShowAssignBox(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (taskName === "") {
                      toast.error("Task Name field is empty...");
                    } else {
                      handleUsers(
                        `${loggedUser.locationId}`,
                        "EMPLOYEE",
                        null,
                        `${loggedUser.deptName}`
                      );
                      setStep("user");
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-500 cursor-pointer"
                >
                  Assign To
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === "user" && (
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Label>Search employees...</Label>
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filter by Department */}
                {/* <div className="space-y-2">
                <Label>Filter by department</Label>
                <Select onValueChange={setDeptFilter} value={deptFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto">
              {allUsers.map((user) => (
                <div
                  key={user.user_id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    assignedUser?.user_id === user.user_id
                      ? "border-blue-500 bg-blue-100"
                      : "hover:border-blue-500 hover:bg-blue-50"
                  }`}
                  onClick={() => {
                    dispatch(setAssignedUser(user));
                  }}
                >
                  <div className="font-medium">{user.user_name}</div>
                  <div className="text-sm text-muted-foreground truncate overflow-hidden whitespace-nowrap">
                    {user.email_id}
                  </div>
                  <div className="flex gap-2 mt-2 text-xs">
                    <span className="bg-green-300 px-2 py-1 rounded">
                      {user.user_role}
                    </span>
                    <span className="bg-cyan-300 px-2 py-1 rounded">
                      {user.department_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <Label>Target Date</Label>
              <Input
                type="date"
                value={targetDate}
                onChange={(e) => dispatch(setTargetDate(e.target.value))}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAssignBox(null)}
                  className="bg-slate-200 hover:bg-slate-400 text-black px-4 py-1.5 rounded cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded cursor-pointer"
                  onClick={() => {
                    if (!assignedUser) {
                      toast.error("Select the user...");
                    } else if (!targetDate) {
                      toast.error("Set the target date...");
                    } else {
                      handleAssign(task);
                      setShowAssignBox(null);
                    }
                  }}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
