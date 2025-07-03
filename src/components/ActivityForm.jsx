import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SquarePen, ArrowLeft, X, CirclePlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetAllCategories } from "./hooks/useGetAllCategories";
import {
  setAllCategories,
  setSelectedCategory,
  setAllActivities,
  setSelectedActivity,
  setAllDepartments,
  setAllUsers,
  setAssignedUser,
  setAllVerifiers,
  setAssignedVerifier,
  setTargetDate,
  setNotes,
} from "./redux/formSlice";
import axios from "axios";
import {
  ACTIVITY_API_END_POINT,
  ADD_ACTIVITY_API,
  DEPT_API_END_POINT,
  USER_API_END_POINT,
  VERIFIER_API_END_POINT,
} from "./utils/api_const";
import { toast } from "sonner";

// function ActivityForm() {
function ActivityForm({ onActivityCreated, statusFilter, setStatusFilter }) {
  const { loggedUser } = useSelector((store) => store.auth);
  const {
    allCategories,
    selectedCategory,
    allActivities,
    selectedActivity,
    allDepartments,
    allUsers,
    assignedUser,
    allVerifiers,
    assignedVerifier,
    targetDate,
    notes,
  } = useSelector((store) => store.form);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("category");
  const [customActivityName, setCustomActivityName] = useState("");
  // const [customActivityDesc, setCustomActivityDesc] = useState("");
  const [userRole, setUserRole] = useState("hod");
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [verifierSearch, setVerifierSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCategory = async () => {
    await useGetAllCategories(dispatch, navigate);
  };

  const handleActivity = async (categoryId) => {
    // API(ACTIVITY_API)--->Connected
    try {
      const response = await axios.get(
        `${ACTIVITY_API_END_POINT}/${categoryId}/`
      );
      dispatch(setAllActivities(response.data.activities));
    } catch (error) {
      console.error("Failed to fetch activities", error);
    }
  };

  const handleDept = async (locationId) => {
    // API(DEPT_API)--->Connected
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
    // API(USERS_API)--->Connected
    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleVerifiers = async (locationId, userName) => {
    // API(VERIFIERS_API)--->Connected
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (userName) params.append("user_name", userName);

      const response = await axios.get(
        // `${VERIFIER_API_END_POINT}/${locationId}/`
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
      setStep("category");
      dispatch(setAllCategories([]));
      dispatch(setSelectedCategory(""));
      dispatch(setAllActivities([]));
      dispatch(setSelectedActivity(""));
      setCustomActivityName("");
      // setCustomActivityDesc("");
      setUserRole("hod");
      dispatch(setAllUsers([]));
      dispatch(setAssignedUser(""));
      dispatch(setAllDepartments([]));
      dispatch(setAllVerifiers([]));
      dispatch(setAssignedVerifier(""));
      dispatch(setTargetDate(""));
      dispatch(setNotes(""));
      setSearchTerm("");
      setDeptFilter("");
      setVerifierSearch("");
    }
  }, [isDialogOpen]);

  useEffect(() => {
    // const delayDebounce = setTimeout(() => {
    if (step === "user") {
      handleUsers(`${loggedUser.locationId}`, userRole, searchTerm, deptFilter);
    }
    if (step === "summary") {
      handleVerifiers(`${loggedUser.locationId}`, verifierSearch);
    }

    // }, 100); // debounce to avoid too many API calls

    // return () => clearTimeout(delayDebounce);
  }, [userRole, searchTerm, deptFilter, verifierSearch]);

  const handleCreateActivity = async (formData) => {
    // API(ADD_ACTIVITY_API)--->Connected
    try {
      const res = await axios.post(`${ADD_ACTIVITY_API}`, formData);

      if (res.data.success) {
        toast.success("Activity Assigned Successfully.");

        // Call the refresh callback if provided
        if (onActivityCreated) {
          await onActivityCreated();
          setStatusFilter("");
        }
      } else {
        toast.error("Activity Creation Failed");
      }
    } catch (error) {
      toast.error("Activity Creation Failed");
    } finally {
      setIsDialogOpen(false);
    }
  };

  const formData = {
    category: selectedCategory.category_id,
    ActivityName: selectedActivity.activity_name,
    assign_to: assignedUser.user_id,
    AssignedUserRole: assignedUser.user_role,
    verifier: assignedVerifier.user_id,
    TargetDate: targetDate,
    created_by: loggedUser.user_id,
    CreatedOn: new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, -1),
    status: 1,
    department: assignedUser.department_id,
    AdditionalNote: notes,
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={handleCategory}
            className="bg-blue-600 hover:bg-blue-500 cursor-pointer"
          >
            <SquarePen className="mr-2 h-4 w-4:" />
            Create Activity
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {step !== "category" && (
            <Button
              variant="ghost"
              onClick={() => {
                if (step === "activity") setStep("category");
                else if (step === "customActivity") setStep("activity");
                else if (step === "user") setStep("activity");
                else if (step === "summary") setStep("user");
              }}
              className="border border-black bg-blue-300 hover:bg-blue-500 cursor-pointer absolute left-6 top-4 p-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </Button>
          )}

          <DialogHeader>
            <DialogTitle className="text-center">
              {step === "summary" ? "Assign Activity" : "Create New Activity"}
            </DialogTitle>
            {step === "category" && (
              <DialogDescription className="text-center">
                Create and assign activities to users or department heads
              </DialogDescription>
            )}
          </DialogHeader>

          {/* Step 1: Category Selection */}
          {step === "category" && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Select Category</h3>
              <div className="grid grid-cols-2 gap-4">
                {allCategories.map((category) => (
                  <div
                    key={category.category_id}
                    className={`cursor-pointer transition-colors rounded-xl border-1 ${
                      selectedCategory?.category_id === category.category_id
                        ? "border-blue-500 bg-blue-100"
                        : "hover:border-blue-500 hover:bg-blue-50 bg-gray-100"
                    }`}
                    onClick={() => {
                      dispatch(setSelectedCategory(category));
                      handleActivity(category.category_id);
                      setStep("activity");
                    }}
                  >
                    <CardContent className="p-1">
                      <h3 className="font-medium text-center">
                        {category.category_name}
                      </h3>
                      {/* <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p> */}
                    </CardContent>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Activity Selection */}
          {step === "activity" && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Select Activities</h3>
                <Button
                  className="bg-blue-600 hover:bg-blue-500 cursor-pointer"
                  onClick={() => setStep("customActivity")}
                >
                  <CirclePlus className="mr-2 h-4 w-4" />
                  Add Custom Activity
                </Button>
              </div>

              <div className="space-y-3">
                {allActivities.map((activity) => (
                  <div
                    key={activity.sa_id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedActivity?.sa_id === activity.sa_id
                        ? "border-blue-500 bg-blue-100"
                        : "hover:border-blue-500 hover:bg-blue-50"
                    }`}
                    onClick={() => {
                      dispatch(setSelectedActivity(activity));
                      handleUsers(`${loggedUser.locationId}`, userRole);
                      handleDept(`${loggedUser.locationId}`);
                      setStep("user");
                    }}
                  >
                    <h4 className="font-medium">{activity.activity_name}</h4>
                    {/* <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p> */}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Custom Activity */}
          {step === "customActivity" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Add Custom Activity</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Activity Name</Label>
                  <Input
                    placeholder="Enter activity name"
                    value={customActivityName}
                    onChange={(e) => setCustomActivityName(e.target.value)}
                  />
                </div>

                {/* <div className="space-y-2">
                  <Label>Activity Description</Label>
                  <Textarea
                    placeholder="Enter activity description"
                    value={customActivityDesc}
                    onChange={(e) => setCustomActivityDesc(e.target.value)}
                    rows={3}
                  />
                </div> */}

                <div className="flex justify-end gap-2">
                  <Button
                    className="cursor-pointer"
                    variant="outline"
                    onClick={() => setStep("activity")}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (customActivityName === "") {
                        toast.error("Set the custom activity...");
                      } else {
                        dispatch(
                          setSelectedActivity({
                            activity_name: customActivityName,
                            // activity_desc: customActivityDesc,
                          })
                        );
                        handleUsers(`${loggedUser.locationId}`, userRole);
                        handleDept(`${loggedUser.locationId}`);
                        setStep("user");
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-500 cursor-pointer"
                  >
                    Add Custom Activity
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Assign User */}
          {step === "user" && (
            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-end space-x-4">
                  {/* User Role Toggle */}
                  <div className="space-y-2">
                    <Label>Select UserRole</Label>
                    <div className="flex border rounded-md p-1 gap-2 bg-muted">
                      <button
                        className={`px-4 py-1 text-sm cursor-pointer rounded-md  ${
                          userRole === "hod"
                            ? "bg-blue-500 text-white"
                            : "hover:bg-white"
                        }`}
                        onClick={() => setUserRole("hod")}
                      >
                        HOD
                      </button>
                      <button
                        className={`px-4 py-1 text-sm cursor-pointer rounded-md ${
                          userRole === "employee"
                            ? "bg-blue-500 text-white"
                            : "hover:bg-white"
                        }`}
                        onClick={() => setUserRole("employee")}
                      >
                        Employee
                      </button>
                    </div>
                  </div>

                  {/* Conditionally displayed search */}
                  {userRole === "employee" && (
                    <div className="space-y-2">
                      <Label>Search employees...</Label>
                      <Input
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Filter by department</Label>
                  <Select onValueChange={setDeptFilter} value={deptFilter}>
                    <SelectTrigger>
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

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg border border-gray-200"
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
                //  Search feature without multidept hods
                // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto">
                //   {allUsers.map((user) => (
                //     <div
                //       key={user.user_id}
                //       className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                //         assignedUser?.user_id === user.user_id
                //           ? "border-blue-500 bg-blue-100"
                //           : "hover:border-blue-500 hover:bg-blue-50"
                //       }`}
                //       onClick={() => {
                //         dispatch(setAssignedUser(user));
                //         handleVerifiers(`${loggedUser.locationId}`);
                //         setStep("summary");
                //       }}
                //     >
                //       <div className="font-medium">{user.user_name}</div>
                //       <div className="text-sm text-muted-foreground truncate overflow-hidden whitespace-nowrap">
                //         {user.email_id}
                //       </div>
                //       <div className="flex gap-2 mt-2 text-xs">
                //         <span className="bg-green-300 px-2 py-1 rounded">
                //           {user.user_role}
                //         </span>
                //         {user.departments.map((dept, index) => (
                //           <span
                //             key={index}
                //             className="bg-cyan-300 px-2 py-1 rounded mr-2"
                //           >
                //             {dept.department_name}
                //           </span>
                //         ))}
                //       </div>
                //     </div>
                //   ))}
                // </div>

                //  Search feature with multidept hods but not proper
                // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto">
                //   {allUsers.flatMap((user) =>
                //     user.hod_departments.length > 0
                //       ? deptFilter
                //         ? user.hod_departments
                //         : user.hod_departments.map((dept, index) => (
                //             <div
                //               key={`${user.user_id}-${dept.department_id}`}
                //               className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                //                 assignedUser?.user_id === user.user_id &&
                //                 assignedUser?.department_id === dept.department_id
                //                   ? "border-blue-500 bg-blue-100"
                //                   : "hover:border-blue-500 hover:bg-blue-50"
                //               }`}
                //               onClick={() => {
                //                 dispatch(
                //                   setAssignedUser({
                //                     ...user,
                //                     department_id: dept.department_id,
                //                     department_name: dept.department_name,
                //                   })
                //                 );
                //                 handleVerifiers(`${loggedUser.locationId}`);
                //                 setStep("summary");
                //               }}
                //             >
                //               <div className="font-medium">{user.user_name}</div>
                //               <div className="text-sm text-muted-foreground truncate overflow-hidden whitespace-nowrap">
                //                 {user.email_id}
                //               </div>
                //               <div className="flex gap-2 mt-2 text-xs">
                //                 <span className="bg-green-300 px-2 py-1 rounded">
                //                   {user.user_role}
                //                 </span>
                //                 <span className="bg-cyan-300 px-2 py-1 rounded">
                //                   {dept.department_name}
                //                 </span>
                //               </div>
                //             </div>
                //           ))
                //       : [
                //           <div
                //             key={user.user_id}
                //             className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                //               assignedUser?.user_id === user.user_id
                //                 ? "border-blue-500 bg-blue-100"
                //                 : "hover:border-blue-500 hover:bg-blue-50"
                //             }`}
                //             onClick={() => {
                //               dispatch(
                //                 setAssignedUser({
                //                   ...user,
                //                   department_id: user.departmentId,
                //                   department_name: user.departmentName,
                //                 })
                //               );
                //               handleVerifiers(`${loggedUser.locationId}`);
                //               setStep("summary");
                //             }}
                //           >
                //             <div className="font-medium">{user.user_name}</div>
                //             <div className="text-sm text-muted-foreground truncate overflow-hidden whitespace-nowrap">
                //               {user.email_id}
                //             </div>
                //             <div className="flex gap-2 mt-2 text-xs">
                //               <span className="bg-green-300 px-2 py-1 rounded">
                //                 {user.user_role}
                //               </span>
                //               <span className="bg-cyan-300 px-2 py-1 rounded">
                //                 {user.departmentName}
                //               </span>
                //             </div>
                //           </div>,
                //         ]
                //   )}
                // </div>

                // Finally Search feature with multidept hods
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto">
                  {allUsers.flatMap((user) => {
                    // Filter HOD departments based on deptFilter if provided
                    const filteredDepts =
                      user.hod_departments.length > 0
                        ? deptFilter
                          ? user.hod_departments.filter(
                              (dept) =>
                                dept.department_name
                                  .toLowerCase()
                                  .includes(deptFilter.toLowerCase()) ||
                                dept.department_id?.toString() === deptFilter
                            )
                          : user.hod_departments
                        : [];

                    // Render blocks for HODs
                    if (filteredDepts.length > 0) {
                      return filteredDepts.map((dept) => (
                        <div
                          key={`${user.user_id}-${dept.department_id}`}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            assignedUser?.user_id === user.user_id &&
                            assignedUser?.department_id === dept.department_id
                              ? "border-blue-500 bg-blue-100"
                              : "hover:border-blue-500 hover:bg-blue-50"
                          }`}
                          onClick={() => {
                            dispatch(
                              setAssignedUser({
                                ...user,
                                department_id: dept.department_id,
                                department_name: dept.department_name,
                              })
                            );
                            handleVerifiers(`${loggedUser.locationId}`);
                            setStep("summary");
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
                              {dept.department_name}
                            </span>
                          </div>
                        </div>
                      ));
                    }

                    // Render regular (non-HOD) user if they match deptFilter (or no filter)
                    if (
                      user.hod_departments.length === 0 &&
                      (!deptFilter ||
                        user.departmentName
                          .toLowerCase()
                          .includes(deptFilter.toLowerCase()) ||
                        user.departmentId?.toString() === deptFilter)
                    ) {
                      return (
                        <div
                          key={user.user_id}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            assignedUser?.user_id === user.user_id
                              ? "border-blue-500 bg-blue-100"
                              : "hover:border-blue-500 hover:bg-blue-50"
                          }`}
                          onClick={() => {
                            dispatch(
                              setAssignedUser({
                                ...user,
                                department_id: user.departmentId,
                                department_name: user.departmentName,
                              })
                            );
                            handleVerifiers(`${loggedUser.locationId}`);
                            setStep("summary");
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
                              {user.departmentName}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    return []; // Don't render anything if no matches
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Activity Summary */}
          {step === "summary" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Activity Summary</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Category</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedCategory.category_name}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Assigned To</p>
                    <p className="text-sm text-muted-foreground">
                      {assignedUser.user_name}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Activity</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedActivity.activity_name}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium">Assigned By</p>
                    <p className="text-sm text-muted-foreground">
                      {loggedUser.user_name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-8 items-center">
                  <h3 className="text-lg font-medium">
                    Select Verifier(Optional)
                  </h3>
                  <p className="text-base text-muted-foreground">
                    {assignedVerifier.user_name}
                  </p>
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Search verifiers..."
                    value={verifierSearch}
                    onChange={(e) => setVerifierSearch(e.target.value)}
                  />
                </div>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-lg border border-gray-200"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[200px] overflow-y-auto">
                    {allVerifiers.map((verifier) => (
                      <div
                        key={verifier.user_id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          assignedVerifier?.user_id === verifier.user_id
                            ? "border-blue-500 bg-blue-100"
                            : "hover:border-blue-500 hover:bg-blue-50"
                        }`}
                        onClick={() => dispatch(setAssignedVerifier(verifier))}
                      >
                        <div className="font-medium">{verifier.user_name}</div>
                        <div className="text-sm text-muted-foreground truncate overflow-hidden whitespace-nowrap">
                          {verifier.email_id}
                        </div>
                        <div className="flex gap-2 mt-2 text-xs">
                          <span className="bg-green-300 px-2 py-1 rounded">
                            {verifier.user_role}
                          </span>
                          <span className="bg-cyan-300 px-2 py-1 rounded">
                            {verifier.department_name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Target Date</Label>
                  <Input
                    type="date"
                    value={targetDate}
                    onChange={(e) => dispatch(setTargetDate(e.target.value))}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Additional Notes (Optional)</Label>
                  <Textarea
                    placeholder="Add any specific instructions or context for this activity..."
                    value={notes}
                    onChange={(e) => dispatch(setNotes(e.target.value))}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-500 cursor-pointer"
                  onClick={() => {
                    // if (assignedVerifier === "") {
                    //   toast.error("Select the verifier...");
                    // } else
                    if (!targetDate) {
                      toast.error("Set the target date...");
                    } else {
                      handleCreateActivity(formData);
                    }
                  }}
                >
                  Assign Activity
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ActivityForm;
