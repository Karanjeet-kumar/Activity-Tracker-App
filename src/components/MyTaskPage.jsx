import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "./shared/Navbar";
import Nav from "./shared/Nav";
import {
  CalendarDays,
  LayoutGrid,
  List,
  Search,
  SquareCheckBig,
} from "lucide-react";
import { useEffect, useState } from "react";
import useGetAllAssignedTasks from "./hooks/useGetAllAssignedTasks";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { ADD_TASK_UPDATE_API } from "./utils/api_const";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import TaskForm from "./TaskForm";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useNav } from "./context/NavContext";

function MyTaskPage() {
  const { isNavVisible } = useNav();
  const { loggedUser } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(true);
  const [showUpdateBox, setShowUpdateBox] = useState(null);
  const [taskFilter, setTaskFilter] = useState("all");
  const [remarks, setRemarks] = useState("");
  const { allAssignedTask } = useSelector((store) => store.task);

  // +++ ADDED VIEW STATE +++
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'list'

  // UseLoadTaskPage();
  const { refresh } = useGetAllAssignedTasks();
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
                <p className="text-muted-foreground">Loading tasks...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdate = async (task) => {
    try {
      // Create new TrnTaskUpdate record and Updata TrnActivityTask status
      // API(ADD_TASK_UPDATE_API)--->Connected
      await axios.post(ADD_TASK_UPDATE_API, {
        task_id: task.TaskId,
        action_by: loggedUser.user_id,
        ActionOn: new Date(
          new Date().getTime() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, -1),
        action_status: taskFilter,
        Remarks: remarks,
      });
      // Optionally refetch activities or update local state
      await refresh();
      toast.success("Task Updated Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task.");
    }
  };

  const renderTasks = () => {
    if (allAssignedTask?.length === 0) {
      return (
        <div>
          {/* No Activities Section */}
          <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center space-y-4 bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer">
            <div className="bg-blue-100 rounded-full p-4">
              <SquareCheckBig className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">
              No tasks found
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              You don't have any tasks yet
            </p>
          </div>
        </div>
      );
    }

    // Card View
    if (viewMode === "card") {
      // return (
      //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
      //     {allAssignedTask.map((task) => (
      //       <Card key={task.TaskId}>
      //         <CardHeader>
      //           <div>
      //             <div className="flex justify-between items-start">
      //               <div>
      //                 <CardTitle className="text-xl">
      //                   {task.TaskDescription}
      //                 </CardTitle>
      //                 {/* <p className="text-sm text-gray-500">
      //                 {task.TaskDescription}
      //               </p> */}
      //               </div>

      //               <div className="flex gap-2">
      //                 <Button
      //                   className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded cursor-pointer"
      //                   onClick={() => {
      //                     setShowUpdateBox((prev) =>
      //                       prev === task.TaskId ? null : task.TaskId
      //                     );
      //                     setRemarks("");
      //                     setTaskFilter("all");
      //                   }}
      //                 >
      //                   {showUpdateBox === task.TaskId ? "Cancel" : "Update"}
      //                 </Button>
      //                 {!!loggedUser?.isHOD && <TaskForm task={task} />}
      //               </div>
      //             </div>

      //             {/* Update Box Section */}
      //             {showUpdateBox === task.TaskId && (
      //               <div className="mt-1 p-2 bg-white rounded-lg shadow-md border border-gray-300">
      //                 <div className="space-y-4">
      //                   {/* Task Status Dropdown */}
      //                   <div>
      //                     <Select
      //                       onValueChange={setTaskFilter}
      //                       value={taskFilter}
      //                     >
      //                       <SelectTrigger className="w-full p-2 rounded-lg shadow-md border border-gray-300">
      //                         <SelectValue placeholder="Select Status" />
      //                       </SelectTrigger>
      //                       <SelectContent>
      //                         <SelectItem value="all">
      //                           Select Status...
      //                         </SelectItem>
      //                         <SelectItem value="3">In Progress</SelectItem>
      //                         <SelectItem value="5">Completed</SelectItem>
      //                       </SelectContent>
      //                     </Select>
      //                   </div>

      //                   {/* Remarks Textarea */}
      //                   <div>
      //                     <Textarea
      //                       value={remarks}
      //                       onChange={(e) => setRemarks(e.target.value)}
      //                       placeholder="Enter your remarks here..."
      //                       className="w-full p-2 min-h-[80px]"
      //                     />
      //                   </div>

      //                   {/* Confirm Button */}
      //                   <div className="flex justify-end pt-2">
      //                     <Button
      //                       className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded cursor-pointer"
      //                       onClick={() => {
      //                         if (taskFilter === "all") {
      //                           toast.error("Select task status...");
      //                         } else {
      //                           handleUpdate(task);
      //                           setRemarks("");
      //                           setShowUpdateBox(null);
      //                         }
      //                       }}
      //                     >
      //                       Confirm Update
      //                     </Button>
      //                   </div>
      //                 </div>
      //               </div>
      //             )}
      //           </div>
      //         </CardHeader>

      //         <CardContent className="space-y-5">
      //           <div className="flex justify-between items-center">
      //             <div className="flex items-center space-x-2">
      //               <p>Status</p>
      //               <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
      //                 {task.Status}
      //               </span>
      //             </div>

      //             <div className="text-sm">
      //               <p>Due Date</p>
      //               <div className="flex items-center text-sm text-gray-600">
      //                 <CalendarDays className="h-4 w-4 mr-1" />
      //                 <span>{task.TargetDate}</span>
      //               </div>
      //             </div>
      //           </div>

      //           <div className="flex justify-between items-center">
      //             <div>
      //               <p className="text-sm font-semibold text-gray-800 mb-1">
      //                 Description
      //               </p>
      //               <p className="text-sm text-gray-700">{task.Remarks}</p>
      //             </div>

      //             <div className="text-sm">
      //               <p>Assigned Date</p>
      //               <div className="flex items-center text-sm text-gray-600">
      //                 <CalendarDays className="h-4 w-4 mr-1" />
      //                 <span>{task.AssignedOn}</span>
      //               </div>
      //             </div>
      //           </div>

      //           <div className="flex justify-between items-center pt-2 border-t">
      //             <div>
      //               <p className="text-xs text-gray-500">Assigned By</p>
      //               <p className="text-sm text-gray-800">{task.CreatedBy}</p>
      //             </div>

      //             <div>
      //               <p className="text-xs text-gray-500">Verifier</p>
      //               <p className="text-sm text-gray-800">{task.Verifier}</p>
      //             </div>
      //           </div>
      //         </CardContent>
      //       </Card>
      //     ))}
      //   </div>
      // );

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {allAssignedTask.map((task) => (
            <div
              key={task.TaskId}
              className=" border border-gray-400 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader className="p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="max-w-[60%]">
                    <CardTitle className="text-base font-medium text-gray-800 line-clamp-2">
                      {task.TaskDescription}
                    </CardTitle>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        setShowUpdateBox((prev) =>
                          prev === task.TaskId ? null : task.TaskId
                        );
                        setRemarks("");
                        setTaskFilter("all");
                      }}
                      disabled={["Completed", "Verified"].includes(task.Status)}
                    >
                      {showUpdateBox === task.TaskId ? "✕ Cancel" : "Update"}
                    </Button>
                    {!!loggedUser?.isHOD && <TaskForm task={task} />}
                  </div>
                </div>

                {/* Status and Dates */}
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded border ${
                      task.Status === "Completed"
                        ? "bg-gradient-to-r from-green-500 to-green-300 border-green-800 text-green-800"
                        : task.Status === "InProgress"
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-300 border-yellow-800 text-yellow-800"
                        : task.Status === "Verified"
                        ? "bg-gradient-to-r from-orange-500 to-orange-300 border-orange-800 text-orange-800"
                        : "bg-gradient-to-r from-blue-500 to-blue-300 border-blue-800 text-blue-800"
                    }`}
                  >
                    {task.Status}
                  </span>
                  <div>
                    <p className=" text-xs font-medium text-gray-700 mb-0.5">
                      Target Date
                    </p>
                    <div className="text-xs text-gray-500 flex items-center">
                      <CalendarDays className="h-3.5 w-3.5 mr-1" />
                      {task.TargetDate}
                    </div>
                  </div>
                </div>

                {/* Update Box Section */}
                {showUpdateBox === task.TaskId && (
                  <div className="mt-1 p-2 bg-gray-50 rounded-md border border-gray-200">
                    <div className="space-y-2">
                      <Select onValueChange={setTaskFilter} value={taskFilter}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Select Status...</SelectItem>
                          <SelectItem value="3">In Progress</SelectItem>
                          <SelectItem value="5">Completed</SelectItem>
                        </SelectContent>
                      </Select>

                      <Textarea
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Remarks..."
                        className="text-xs min-h-[60px]"
                      />

                      <div className="flex justify-end pt-1">
                        <Button
                          size="sm"
                          className="h-7 px-3 text-xs bg-blue-600 hover:bg-blue-700 cursor-pointer"
                          onClick={() => {
                            if (taskFilter === "all") {
                              toast.error("Select task status...");
                            } else {
                              handleUpdate(task);
                              setRemarks("");
                              setShowUpdateBox(null);
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
                  <p className="text-gray-600 line-clamp-3">{task.Remarks}</p>
                </div>

                <div
                  className={` rounded-2xl flex justify-between text-xs p-2 border ${
                    task.Status === "Completed"
                      ? "bg-gradient-to-r from-green-500 to-green-300 border-green-800 "
                      : task.Status === "InProgress"
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-300 border-yellow-800 "
                      : task.Status === "Verified"
                      ? "bg-gradient-to-r from-orange-500 to-orange-300 border-orange-800 "
                      : "bg-gradient-to-r from-blue-500 to-blue-300 border-blue-800 "
                  }`}
                >
                  <div>
                    <p className="text-gray-500">Started On:</p>
                    <p className="text-gray-700">
                      {task.AssignedOn.split("T")[0]}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Assigned By:</p>
                    <p className="text-gray-700 truncate max-w-[100px]">
                      {task.CreatedBy}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Verifier:</p>
                    <p className="text-gray-700 truncate max-w-[100px]">
                      {task.Verifier}
                    </p>
                  </div>
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
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Started On
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verifier
              </th>
              <th className="px-7 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allAssignedTask.map((task) => (
              <tr key={task.TaskId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {task.TaskDescription}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded border ${
                      task.Status === "Completed"
                        ? "bg-gradient-to-r from-green-500 to-green-300 border-green-800 text-green-800"
                        : task.Status === "InProgress"
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-300 border-yellow-800 text-yellow-800"
                        : task.Status === "Verified"
                        ? "bg-gradient-to-r from-orange-500 to-orange-300 border-orange-800 text-yellow-800"
                        : "bg-gradient-to-r from-blue-500 to-blue-300 border-blue-800 text-blue-800"
                    }`}
                  >
                    {task.Status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    <span>{task.AssignedOn.split("T")[0]}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    <span>{task.TargetDate}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {task.Remarks}
                </td>

                <td className="px-6 py-4 text-sm text-gray-500">
                  {task.CreatedBy}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {task.Verifier}
                </td>
                <td className="px-4 py-4 flex gap-2 whitespace-nowrap text-sm text-gray-500">
                  <Dialog
                    open={showUpdateBox === task.TaskId}
                    onOpenChange={(isOpen) => {
                      if (!isOpen) setShowUpdateBox(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => {
                          setShowUpdateBox(task.TaskId);
                          setRemarks("");
                          setTaskFilter("all");
                        }}
                        disabled={["Completed", "Verified"].includes(
                          task.Status
                        )}
                      >
                        Update
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Update Task</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        {/* Task Status Dropdown */}
                        <div>
                          <Select
                            onValueChange={setTaskFilter}
                            value={taskFilter}
                          >
                            <SelectTrigger className="w-full p-2 rounded-lg shadow-md border border-gray-300">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                Select Status...
                              </SelectItem>
                              <SelectItem value="3">In Progress</SelectItem>
                              <SelectItem value="5">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Remarks Textarea */}
                        <div>
                          <Textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Enter your remarks here..."
                            className="w-full p-2 min-h-[80px]"
                          />
                        </div>

                        {/* Confirm Button */}
                        <div className="flex justify-end gap-2 pt-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowUpdateBox(null)}
                            className="bg-slate-200 hover:bg-slate-400 text-black px-4 py-1.5 rounded cursor-pointer"
                          >
                            Cancel
                          </Button>
                          <Button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded cursor-pointer"
                            onClick={() => {
                              handleUpdate(task);
                              setRemarks("");
                              setShowUpdateBox(null);
                            }}
                          >
                            Confirm Update
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {!!loggedUser.isHOD && <TaskForm task={task} />}
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
                <SquareCheckBig className="text-blue-600" size={30} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">My Tasks</h1>
                <h1 className="text-1xl text-gray-400 font-bold">
                  Manage and track all tasks
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

          {/* Status Filter Tabs */}
          <div className="mb-6">
            <Tabs
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
              }}
            >
              <TabsList className="grid grid-cols-5 w-full gap-2 bg-cyan-300">
                <TabsTrigger
                  value=""
                  className="bg-white hover:bg-orange-200 data-[state=active]:bg-orange-400"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="2"
                  className="bg-white hover:bg-blue-200 data-[state=active]:bg-blue-400"
                >
                  Open
                </TabsTrigger>
                <TabsTrigger
                  value="3"
                  className="bg-white hover:bg-yellow-200 data-[state=active]:bg-yellow-400"
                >
                  In Progress
                </TabsTrigger>
                {/* <TabsTrigger
                  value="7"
                  className="bg-white hover:bg-red-200 data-[state=active]:bg-red-400"
                >
                  Rejected
                </TabsTrigger> */}
                <TabsTrigger
                  value="5"
                  className="bg-white hover:bg-green-200 data-[state=active]:bg-green-400"
                >
                  Completed
                </TabsTrigger>
                <TabsTrigger
                  value="8"
                  className="bg-white hover:bg-orange-200 data-[state=active]:bg-orange-400"
                >
                  Verified
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="mb-2">
            <h1 className="text-lg font-bold">Tasks I've Assigned</h1>
          </div>
          <div className="mb-3 flex items-center">
            {/* <Input placeholder="Search your tasks..." className="max-w-6xl" /> */}
            <div className="relative w-full max-w-6xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search your tasks..."
                className="pl-10 py-3 text-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {/* +++ RENDER CONDITIONAL VIEW +++ */}
          {renderTasks()}
        </div>
      </div>
    </div>
  );
}

export default MyTaskPage;
