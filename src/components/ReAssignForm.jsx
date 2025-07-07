import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, ShieldCheck, SquarePen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setAllDepartments,
  setAllUsers,
  setAssignedUser,
  setAllVerifiers,
  setAssignedVerifier,
  setTargetDate,
} from "./redux/formSlice";
import { toast } from "sonner";
import {
  ADD_ACTIVITY_API,
  DEPT_API_END_POINT,
  TRN_ACTIVITY_API_END_POINT,
  USER_API_END_POINT,
  VERIFIER_API_END_POINT,
} from "./utils/api_const";

function ReAssignForm({ activity, refresh, statusFilter, setStatusFilter }) {
  const { loggedUser } = useSelector((store) => store.auth);
  const {
    allDepartments,
    allUsers,
    assignedUser,
    allVerifiers,
    assignedVerifier,
    targetDate,
  } = useSelector((store) => store.form);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState("summary");
  const [userRole, setUserRole] = useState("hod");
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [verifierSearch, setVerifierSearch] = useState("");
  const dispatch = useDispatch();

  const handleDept = async (locationId) => {
    try {
      const response = await axios.get(`${DEPT_API_END_POINT}/${locationId}/`);
      dispatch(setAllDepartments(response.data.departments));
    } catch (error) {
      console.error("Failed to fetch departments", error);
    }
  };

  const handleUsers = async (
    locationId,
    userRole,
    userName,
    departmentName
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (userName) params.append("user_name", userName);
      if (userRole) params.append("user_role", userRole);
      if (departmentName && departmentName !== "all") {
        params.append("department_name", departmentName);
      }

      const response = await axios.get(
        `${USER_API_END_POINT}/${locationId}/?${params.toString()}`
      );
      dispatch(setAllUsers(response.data.users));
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifiers = async (locationId, userName) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (userName) params.append("user_name", userName);

      const response = await axios.get(
        `${VERIFIER_API_END_POINT}/${locationId}/?${params.toString()}`
      );
      dispatch(setAllVerifiers(response.data.verifiers));
    } catch (error) {
      console.error("Failed to fetch verifiers", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset state when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      setActiveStep("summary");
      setUserRole("hod");
      dispatch(setAllUsers([]));
      dispatch(setAssignedUser(""));
      dispatch(setAllDepartments([]));
      dispatch(setAllVerifiers([]));
      dispatch(setAssignedVerifier(""));
      dispatch(setTargetDate(""));
      setSearchTerm("");
      setDeptFilter("");
      setVerifierSearch("");
    }
  }, [isDialogOpen]);

  // Set initial values when dialog opens
  useEffect(() => {
    if (isDialogOpen && activity) {
      // Set target date from activity
      dispatch(setTargetDate(activity.TargetDate));

      // Set user role based on previous assignment
      if (activity.AssignedUserRole) {
        setUserRole(activity.AssignedUserRole.toLowerCase());
      }
    }
  }, [isDialogOpen, activity]);

  // Fetch users when user role, search term, or department filter changes
  useEffect(() => {
    if (isDialogOpen && activeStep === "user") {
      handleUsers(`${loggedUser.locationId}`, userRole, searchTerm, deptFilter);
    }
    if (isDialogOpen && activeStep === "verifier") {
      handleVerifiers(`${loggedUser.locationId}`, verifierSearch);
    }
  }, [
    isDialogOpen,
    activeStep,
    userRole,
    searchTerm,
    deptFilter,
    verifierSearch,
  ]);

  // Fetch verifiers when verifier search term changes
  //   useEffect(() => {
  //     if (isDialogOpen && activeStep === "verifier") {
  //       handleVerifiers(`${loggedUser.locationId}`, verifierSearch);
  //     }
  //   }, [isDialogOpen, activeStep, verifierSearch]);

  // Auto-select previously assigned user when users are loaded
  useEffect(() => {
    if (isDialogOpen && allUsers.length > 0 && activity) {
      const prevUser = allUsers.find(
        (user) => user.user_id === activity.assign_to
      );

      if (prevUser) {
        if (prevUser.user_role === "HOD") {
          const prevDept = prevUser.hod_departments.find(
            (dept) => dept.department_id === activity.department
          );

          if (prevDept) {
            dispatch(
              setAssignedUser({
                ...prevUser,
                department_id: prevDept.department_id,
                department_name: prevDept.department_name,
              })
            );
          }
        } else {
          dispatch(
            setAssignedUser({
              ...prevUser,
              department_id: activity.department,
              department_name: activity.Department,
            })
          );
        }
      }
    }
  }, [allUsers, isDialogOpen, activity]);

  // Auto-select previously assigned verifier when verifiers are loaded
  useEffect(() => {
    if (
      isDialogOpen &&
      allVerifiers.length > 0 &&
      activity &&
      activity.verifier
    ) {
      const prevVerifier = allVerifiers.find(
        (v) => v.user_id === activity.verifier
      );

      if (prevVerifier) {
        dispatch(setAssignedVerifier(prevVerifier));
      }
    }
  }, [allVerifiers, isDialogOpen, activity]);

  const handleEditActivity = async (formData, activity) => {
    try {
      const data = {};

      // Include assigned user only if selected
      if (
        assignedUser?.user_id !== undefined &&
        assignedUser?.user_id !== null
      ) {
        data.assignedUserId = assignedUser.user_id;
      }

      // Include verifier only if selected
      if (
        assignedVerifier?.user_id !== undefined &&
        assignedVerifier?.user_id !== null
      ) {
        data.Verifier_Id = assignedVerifier.user_id;
      }

      // Include target date only if it's picked
      if (targetDate) {
        data.TargetDate = targetDate;
      }

      await axios.put(
        `${TRN_ACTIVITY_API_END_POINT}/edit/${activity.ActivityId}/`,
        data
      );

      if (refresh) await refresh();
      setStatusFilter(statusFilter);
      toast.success("Activity Updated Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update activity.");
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleReassignActivity = async (formData, act) => {
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
      toast.success("Reassigning Initiated");

      // API(ADD_ACTIVITY_API)--->Connected
      const res = await axios.post(`${ADD_ACTIVITY_API}`, formData);

      if (res.data.success) {
        toast.success("Activity Reassigned Successfully.");
        if (refresh) await refresh();
        setStatusFilter("");
      } else {
        toast.error("Reassignment Failed");
      }
    } catch (error) {
      toast.error("Reassignment Failed");
    } finally {
      setIsDialogOpen(false);
    }
  };

  const formData = {
    category: activity.category,
    ActivityName: activity.ActivityName,
    assign_to: assignedUser.user_id || activity.assign_to,
    AssignedUserRole: assignedUser.user_role || activity.AssignedUserRole,
    verifier: assignedVerifier.user_id || activity.verifier,
    TargetDate: targetDate,
    created_by: loggedUser.user_id,
    CreatedOn: new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, -1),
    status: 1,
    department: assignedUser.department_id || activity.department,
    AdditionalNote: activity.AdditionalNote,
  };

  const SummaryCard = ({ title, value, icon, onClick, buttonText }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">{icon}</div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="font-semibold">
              {value || <span className="text-gray-400">Not selected</span>}
            </p>
          </div>
        </div>
        {statusFilter === "7" ? (
          <Button
            variant="outline"
            onClick={onClick}
            className="border-blue-500 text-blue-600 hover:bg-blue-50 cursor-pointer"
          >
            {buttonText}
          </Button>
        ) : (
          <>
            {title === "Verifier" && (
              <Button
                variant="outline"
                onClick={onClick}
                className="border-blue-500 text-blue-600 hover:bg-blue-50 cursor-pointer"
              >
                {buttonText}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              setIsDialogOpen(true);
              // Only fetch departments initially
              handleDept(`${loggedUser.locationId}`);
            }}
            size="sm"
            className="h-7 px-2 text-xs bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-700 hover:to-blue-400 cursor-pointer shadow-md"
          >
            {statusFilter === "7" ? (
              "Reassign"
            ) : (
              <>
                <SquarePen className="mr-2 h-4 w-4:" />
                Edit
              </>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          {activeStep !== "summary" && (
            <Button
              variant="ghost"
              onClick={() => setActiveStep("summary")}
              className="border border-gray-300 bg-white hover:bg-gray-50 cursor-pointer absolute left-6 top-4 p-2"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </Button>
          )}

          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-gray-800">
              {statusFilter === "7" ? "Re-assign Activity" : "Edit Activity"}
            </DialogTitle>
          </DialogHeader>

          {activeStep === "summary" && (
            <div className="mt-4 space-y-6">
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <h3 className="font-bold text-gray-700 mb-3">
                  Activity Details
                </h3>
                <div className="grid grid-cols-2  gap-4">
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500">Activity: </p>
                    <p className="font-medium">{activity.ActivityName}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500">Description:</p>
                    <p className="font-medium">{activity.AdditionalNote}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500">Category: </p>
                    <p className="font-medium">{activity.Category}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500 text-center">
                      Assigned Department:
                    </p>
                    <p className="font-medium text-center">
                      {assignedUser.department_name || activity.Department}
                    </p>
                  </div>
                  {/* <div className="space-y-1">
                    <p className="text-sm text-gray-500">Assigned User</p>
                    <p className="font-medium">
                      {activity.AssignedUser} ({activity.AssignedUserRole})
                    </p>
                  </div> */}
                  {/* <div className="space-y-1">
                    <p className="text-sm text-gray-500">Assigned Verifier</p>
                    <p className="font-medium">{activity.Verifier}</p>
                  </div> */}
                  {/* <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      Previous Target Date
                    </p>
                    <p className="font-medium">
                      {new Date(activity.TargetDate).toLocaleDateString()}
                    </p>
                  </div> */}
                </div>
              </div>

              <div className="space-y-4">
                <SummaryCard
                  title="Assigned To"
                  value={
                    assignedUser.user_name
                      ? `${assignedUser.user_name} (${assignedUser.user_role})`
                      : `${activity.AssignedUser} (${activity.AssignedUserRole})`
                  }
                  icon={<User size={18} />}
                  onClick={() => setActiveStep("user")}
                  // buttonText={"Change User"}
                  buttonText={statusFilter === "7" ? "Change User" : undefined}
                />

                <SummaryCard
                  title="Verifier"
                  value={
                    assignedVerifier.user_name
                      ? `${assignedVerifier.user_name}`
                      : activity.Verifier
                      ? `${activity.Verifier}`
                      : "Not Selected"
                  }
                  icon={<ShieldCheck size={18} />}
                  onClick={() => setActiveStep("verifier")}
                  buttonText={
                    assignedVerifier.user_name || activity.Verifier
                      ? "Change Verifier"
                      : "Assign Verifier"
                  }
                />

                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Target Date
                      </h3>
                    </div>
                  </div>
                  <Input
                    type="date"
                    value={targetDate}
                    onChange={(e) => dispatch(setTargetDate(e.target.value))}
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                {statusFilter === "7" ? (
                  <Button
                    className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 shadow-md cursor-pointer"
                    onClick={() => {
                      handleReassignActivity(formData, activity);
                    }}
                  >
                    Reassign Activity
                  </Button>
                ) : (
                  <Button
                    className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 shadow-md cursor-pointer"
                    onClick={() => {
                      handleEditActivity(formData, activity);
                    }}
                    disabled={
                      !assignedUser.user_id &&
                      !assignedVerifier.user_id &&
                      new Date(targetDate).toLocaleDateString() ===
                        new Date(activity.TargetDate).toLocaleDateString()
                    }
                  >
                    Edit Activity
                  </Button>
                )}
              </div>
            </div>
          )}

          {activeStep === "user" && (
            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-end space-x-4">
                  <div className="space-y-2">
                    <Label className="font-medium text-gray-700">
                      Select Role
                    </Label>
                    <div className="flex border rounded-md p-1 gap-2 bg-gray-50">
                      <button
                        className={`px-4 py-1 text-sm cursor-pointer rounded-md transition-all ${
                          userRole === "hod"
                            ? "bg-blue-600 text-white shadow-inner"
                            : "hover:bg-white"
                        }`}
                        onClick={() => setUserRole("hod")}
                      >
                        HOD
                      </button>
                      <button
                        className={`px-4 py-1 text-sm cursor-pointer rounded-md transition-all ${
                          userRole === "employee"
                            ? "bg-blue-600 text-white shadow-inner"
                            : "hover:bg-white"
                        }`}
                        onClick={() => setUserRole("employee")}
                      >
                        Employee
                      </button>
                    </div>
                  </div>

                  {userRole === "employee" && (
                    <div className="space-y-2">
                      <Label className="font-medium text-gray-700">
                        Search Employees
                      </Label>
                      <Input
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="font-medium text-gray-700">
                    Filter by Department
                  </Label>
                  <Select onValueChange={setDeptFilter} value={deptFilter}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="All departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All departments</SelectItem>
                      {allDepartments.map((dept) => (
                        <SelectItem
                          key={dept.department_id}
                          value={String(dept.department_name)}
                        >
                          {dept.department_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex gap-3 items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Select User
                  </h3>
                  {assignedUser.user_name && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Selected: {assignedUser.user_name}
                    </span>
                  )}
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                      >
                        <div className="animate-pulse space-y-3">
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-300 rounded w-full"></div>
                          <div className="flex gap-2 mt-2">
                            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto">
                    {allUsers.flatMap((user) => {
                      const filteredDepts =
                        user.hod_departments.length > 0
                          ? deptFilter != "all"
                            ? user.hod_departments.filter(
                                (dept) =>
                                  dept.department_name
                                    .toLowerCase()
                                    .includes(deptFilter.toLowerCase()) ||
                                  dept.department_id?.toString() === deptFilter
                              )
                            : user.hod_departments
                          : [];

                      if (filteredDepts.length > 0) {
                        return filteredDepts.map((dept) => (
                          <div
                            key={`${user.user_id}-${dept.department_id}`}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:-translate-y-0.5 ${
                              assignedUser?.user_id === user.user_id &&
                              assignedUser?.department_id === dept.department_id
                                ? "border-blue-500 bg-blue-50 shadow-sm"
                                : "border-gray-200 hover:border-blue-300 bg-white"
                            }`}
                            onClick={() => {
                              dispatch(
                                setAssignedUser({
                                  ...user,
                                  department_id: dept.department_id,
                                  department_name: dept.department_name,
                                })
                              );
                              setActiveStep("summary");
                            }}
                          >
                            <div className="font-medium text-gray-800">
                              {user.user_name}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {user.email_id}
                            </div>
                            <div className="flex gap-2 mt-3">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                {user.user_role}
                              </span>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                {dept.department_name}
                              </span>
                            </div>
                          </div>
                        ));
                      }

                      if (
                        user.hod_departments.length === 0 &&
                        (!deptFilter ||
                          deptFilter === "all" ||
                          user.departmentName
                            .toLowerCase()
                            .includes(deptFilter.toLowerCase()) ||
                          user.departmentId?.toString() === deptFilter)
                      ) {
                        return (
                          <div
                            key={user.user_id}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:-translate-y-0.5 ${
                              assignedUser?.user_id === user.user_id
                                ? "border-blue-500 bg-blue-50 shadow-sm"
                                : "border-gray-200 hover:border-blue-300 bg-white"
                            }`}
                            onClick={() => {
                              dispatch(
                                setAssignedUser({
                                  ...user,
                                  department_id: user.departmentId,
                                  department_name: user.departmentName,
                                })
                              );
                              setActiveStep("summary");
                            }}
                          >
                            <div className="font-medium text-gray-800">
                              {user.user_name}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {user.email_id}
                            </div>
                            <div className="flex gap-2 mt-3">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                {user.user_role}
                              </span>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                {user.departmentName}
                              </span>
                            </div>
                          </div>
                        );
                      }

                      return [];
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeStep === "verifier" && (
            <div className="mt-4 space-y-4">
              <div className="space-y-4 pt-2">
                <div className="flex gap-3 items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Select Verifier
                  </h3>
                  {assignedVerifier.user_name && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Selected: {assignedVerifier.user_name}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="font-medium text-gray-700">
                    Search Verifiers
                  </Label>
                  <Input
                    placeholder="Search by name or email..."
                    value={verifierSearch}
                    onChange={(e) => setVerifierSearch(e.target.value)}
                    className="bg-white"
                  />
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                      >
                        <div className="animate-pulse space-y-3">
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-300 rounded w-full"></div>
                          <div className="flex gap-2 mt-2">
                            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto">
                    {allVerifiers.map((verifier) => (
                      <div
                        key={verifier.user_id}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:-translate-y-0.5 ${
                          assignedVerifier?.user_id === verifier.user_id
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-gray-200 hover:border-blue-300 bg-white"
                        }`}
                        onClick={() => {
                          dispatch(setAssignedVerifier(verifier));
                          setActiveStep("summary");
                        }}
                      >
                        <div className="font-medium text-gray-800">
                          {verifier.user_name}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {verifier.email_id}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {verifier.user_role}
                          </span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            {verifier.department_name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ReAssignForm;
