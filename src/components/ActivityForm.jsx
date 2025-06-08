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

function ActivityForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [step, setStep] = useState("category");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [customActivityName, setCustomActivityName] = useState("");
  const [assignedUser, setAssignedUser] = useState(null);
  const [verifier, setVerifier] = useState(null);
  const [targetDate, setTargetDate] = useState("");
  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [verifierSearch, setVerifierSearch] = useState("");

  // Reset state when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      setStep("category");
      setSelectedCategory("");
      setSelectedActivity("");
      setCustomActivityName("");
      setAssignedUser(null);
      setVerifier(null);
      setTargetDate("");
      setNotes("");
      setSearchTerm("");
      setDeptFilter("");
      setVerifierSearch("");
    }
  }, [isDialogOpen]);

  // Sample data for UI demonstration
  const categories = [
    {
      id: "project",
      name: "Project Management",
      description: "Activities related to project planning, execution...",
    },
    {
      id: "development",
      name: "Development",
      description: "Activities related to software development and coding",
    },
    {
      id: "design",
      name: "Design",
      description: "Activities related to UI/UX and graphic design",
    },
    {
      id: "marketing",
      name: "Marketing",
      description: "Activities related to marketing campaigns...",
    },
  ];

  const designActivities = [
    {
      id: "wireframing",
      name: "Wireframing",
      description: "Create wireframes for new features",
    },
    {
      id: "userTesting",
      name: "User Testing",
      description: "Conduct user testing sessions",
    },
    {
      id: "uiDesign",
      name: "UI Design",
      description: "Design user interface elements",
    },
  ];

  const departments = ["Engineering", "Marketing", "HR", "Finance"];

  // Placeholder functions for UI demonstration
  const getCategoryName = (id) =>
    categories.find((cat) => cat.id === id)?.name || "";
  const getActivityName = (id) =>
    designActivities.find((act) => act.id === id)?.name || customActivityName;
  const handleCreateActivity = () => setIsDialogOpen(false);

  // Placeholder user data for UI
  const placeholderUsers = [
    {
      id: "1",
      name: "Jane Doe",
      email: "jane@example.com",
      role: "USER",
      department: "Engineering",
    },
    {
      id: "2",
      name: "Michael Brown",
      email: "michael@example.com",
      role: "HOD",
      department: "Marketing",
    },
  ];

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-500 cursor-pointer">
            <SquarePen className="mr-2 h-4 w-4" />
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
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    className={`cursor-pointer transition-colors ${
                      selectedCategory === category.id
                        ? "border-blue-500 bg-blue-100"
                        : "hover:border-blue-500 hover:bg-blue-50"
                    }`}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setStep("activity");
                    }}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
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
                {designActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedActivity === activity.id
                        ? "border-blue-500 bg-blue-100"
                        : "hover:border-blue-500 hover:bg-blue-50"
                    }`}
                    onClick={() => {
                      setSelectedActivity(activity.id);
                      setStep("user");
                    }}
                  >
                    <h4 className="font-medium">{activity.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
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

                <div className="space-y-2">
                  <Label>Activity Description</Label>
                  <Textarea
                    placeholder="Enter activity description"
                    value={customActivityName}
                    onChange={(e) => setCustomActivityName(e.target.value)}
                    rows={3}
                  />
                </div>

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
                      setSelectedActivity("custom");
                      setStep("user");
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
                <div className="space-y-2">
                  <Label>Search users...</Label>
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
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
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto">
                {placeholderUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      assignedUser?.id === user.id
                        ? "border-blue-500 bg-blue-100"
                        : "hover:border-blue-500 hover:bg-blue-50"
                    }`}
                    onClick={() => {
                      setAssignedUser(user);
                      setStep("summary");
                    }}
                  >
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground truncate overflow-hidden whitespace-nowrap">
                      {user.email}
                    </div>
                    <div className="flex gap-2 mt-2 text-xs">
                      <span className="bg-green-300 px-2 py-1 rounded">
                        {user.role}
                      </span>
                      <span className="bg-cyan-300 px-2 py-1 rounded">
                        {user.department}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
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
                    <p className="text-sm text-muted-foreground">Design</p>
                  </div>

                  <div>
                    <p className="font-medium">Assigned To</p>
                    <p className="text-sm text-muted-foreground">Jane Doe</p>
                  </div>

                  <div>
                    <p className="font-medium">Activity</p>
                    <p className="text-sm text-muted-foreground">UI Design</p>
                  </div>

                  <div>
                    <p className="font-medium">Assigned By</p>
                    <p className="text-sm text-muted-foreground">John Admin</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Select Verifier</h3>

                <div className="space-y-2">
                  <Input
                    placeholder="Search verifiers..."
                    value={verifierSearch}
                    onChange={(e) => setVerifierSearch(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[200px] overflow-y-auto">
                  {placeholderUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        verifier?.id === user.id
                          ? "border-blue-500 bg-blue-100"
                          : "hover:border-blue-500 hover:bg-blue-50"
                      }`}
                      onClick={() => setVerifier(user)}
                    >
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground truncate overflow-hidden whitespace-nowrap">
                        {user.email}
                      </div>
                      <div className="flex gap-2 mt-2 text-xs">
                        <span className="bg-green-300 px-2 py-1 rounded">
                          {user.role}
                        </span>
                        <span className="bg-cyan-300 px-2 py-1 rounded">
                          {user.department}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Target Date</Label>
                  <Input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Additional Notes (Optional)</Label>
                  <Textarea
                    placeholder="Add any specific instructions or context for this Activity..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
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
                  onClick={handleCreateActivity}
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
