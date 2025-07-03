import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./shared/Navbar";
import Nav from "./shared/Nav";
import {
  AlertCircle,
  CalendarClock,
  CheckCircle,
  CircleAlert,
  CircleCheck,
  CircleCheckBig,
  CircleDashed,
  CircleFadingPlus,
  CircleGauge,
  Clock4,
  LayoutDashboard,
} from "lucide-react";
import { useNav } from "./context/NavContext";
import {
  ACTIVITY_STATUS_COUNT_API_END_POINT,
  TASK_STATUS_COUNT_API_END_POINT,
} from "./utils/api_const";
import { useSelector } from "react-redux";
import ActivityInfo from "./ActivityInfo";
import useLoadActivityPage from "./hooks/useLoadActivityPage";

function Dashboard() {
  const { isNavVisible } = useNav();
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const { loggedUser } = useSelector((store) => store.auth);
  // const { refresh } = useLoadActivityPage();

  const [statusCounts, setStatusCounts] = useState({});
  const [delayedCount, setDelayedCount] = useState(0);
  const [onTrackCount, setOnTrackCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const [selectedCard, setSelectedCard] = useState("Delayed");
  const [delayedActivities, setDelayedActivities] = useState([]);
  const [onTrackActivities, setOnTrackActivities] = useState([]);

  useEffect(() => {
    if (!loggedUser) return;

    setIsLoading(true); // Start loading

    const fetchAdminStatusCounts = async () => {
      try {
        const response = await axios.get(
          `${ACTIVITY_STATUS_COUNT_API_END_POINT}/${loggedUser?.user_id}/`
        );
        setStatusCounts(response.data.status_wise_counts || {});
        setDelayedCount(response.data.delayed_activity_count || 0);
        setOnTrackCount(response.data.onTrack_activity_count || 0);
        setDelayedActivities(response.data.delayed_activities || []);
        setOnTrackActivities(response.data.onTrack_activities || []);
      } catch (error) {
        console.error("Failed to fetch admin activity status counts:", error);
      } finally {
        setIsLoading(false); // End loading regardless of success/failure
      }
    };

    const fetchUserStatusCounts = async () => {
      try {
        const response = await axios.get(
          `${TASK_STATUS_COUNT_API_END_POINT}/${loggedUser.user_id}/`
        );
        setStatusCounts(response.data.status_wise_counts || {});
        setDelayedCount(response.data.delayed_task_count || 0);
      } catch (error) {
        console.error("Failed to fetch user task status counts:", error);
      } finally {
        setIsLoading(false); // End loading regardless of success/failure
      }
    };

    if (loggedUser.isAdmin) {
      fetchAdminStatusCounts();
    } else {
      fetchUserStatusCounts();
    }
  }, []);

  useEffect(() => {
    if (loggedUser?.isAdmin) {
      setSelectedCard("Delayed");
    }
  }, [loggedUser]);

  let cards = [];

  if (loggedUser?.isAdmin) {
    cards = [
      {
        title: "Delayed",
        value: delayedCount,
        gradient: "from-red-200 to-red-100",
        border: "border-red-800",
        icon: <CircleGauge size={30} />,
      },
      {
        title: "On Track",
        value: onTrackCount,
        gradient: "from-green-200 to-green-100",
        border: "border-green-800",
        icon: <CheckCircle size={30} />,
      },
      {
        title: "New",
        value: statusCounts["New"] || 0,
        gradient: "from-blue-200 to-blue-100",
        border: "border-blue-800",
        icon: <CircleFadingPlus size={30} />,
      },
      {
        title: "In Progress",
        value: statusCounts["InProgress"] || 0,
        gradient: "from-yellow-200 to-yellow-100",
        border: "border-yellow-800",
        icon: <Clock4 size={30} />,
      },
      {
        title: "Completed",
        value: statusCounts["Completed"] || 0,
        gradient: "from-green-200 to-green-100",
        border: "border-green-800",
        icon: <CircleCheck size={30} />,
      },
      {
        title: "Pending",
        value: statusCounts["Rejected"] || 0,
        gradient: "from-red-200 to-red-100",
        border: "border-red-800",
        icon: <CircleAlert size={30} />,
      },
    ];
  } else if (loggedUser) {
    cards = [
      {
        title: "Delayed",
        value: delayedCount,
        gradient: "from-red-200 to-red-100",
        border: "border-red-800",
        icon: <CircleGauge size={30} />,
      },
      {
        title: "Open",
        value: statusCounts["Open"] || 0,
        gradient: "from-blue-200 to-blue-100",
        border: "border-blue-800",
        icon: <CircleDashed size={30} />,
      },
      {
        title: "In Progress",
        value: statusCounts["InProgress"] || 0,
        gradient: "from-yellow-200 to-yellow-100",
        border: "border-yellow-800",
        icon: <Clock4 size={30} />,
      },
      {
        title: "Completed",
        value: statusCounts["Completed"] || 0,
        gradient: "from-green-200 to-green-100",
        border: "border-green-800",
        icon: <CircleCheck size={30} />,
      },
      {
        title: "Re Open",
        value: statusCounts["ReOpen"] || 0,
        gradient: "from-red-200 to-red-100",
        border: "border-red-800",
        icon: <CircleAlert size={30} />,
      },
      {
        title: "Verified",
        value: statusCounts["Verified"] || 0,
        gradient: "from-orange-200 to-orange-100",
        border: "border-orange-800",
        icon: <CheckCircle size={30} />,
      },
    ];
  }

  // Loading state rendering
  if (!loggedUser || isLoading) {
    return (
      <div>
        <Navbar />
        <div className="flex h-screen">
          <Nav />
          <div className="flex-1 overflow-auto p-6 h-[calc(100vh-4rem)]">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-gray-200 rounded-md p-1 animate-pulse">
                <div className="w-8 h-8" />
              </div>
              <div>
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-6 w-64 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Metrics Cards Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center cursor-pointer h-20 border-l-4 border-gray-300 rounded-lg p-2 bg-gray-100 animate-pulse"
                >
                  <div className="p-1 bg-gray-200 rounded-full w-10 h-10"></div>
                  <div>
                    <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 w-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Activities Table Skeleton */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </th>
                      <th className="px-6 py-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </th>
                      <th className="px-6 py-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </th>
                      <th className="px-6 py-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </th>
                      <th className="px-6 py-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex h-screen">
        <Nav />
        {/* Main Content */}
        <div
          className={`flex-1 overflow-auto p-6 h-[calc(100vh-4rem)] transition-all duration-300 ${
            isNavVisible ? "ml-64" : "ml-0"
          }`}
        >
          <div className="flex items-center gap-2 mb-8 ">
            <div className="bg-blue-200 rounded-md p-1">
              <LayoutDashboard size={30} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">DashBoard</h1>
              <h1 className="text-1xl text-gray-400 font-bold">
                {formattedDate}
              </h1>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {cards.map((card) => (
              <div
                key={card.title}
                onClick={() => setSelectedCard(card.title)}
                className={`flex justify-between items-center cursor-pointer transform transition-all duration-200 h-20
                  ${
                    selectedCard === card.title
                      ? `border-l-4 border-1 ${card.border} scale-105 bg-gradient-to-r ${card.gradient} shadow-lg scale-[1.02]`
                      : `border-l-4 border-1 ${card.border} hover:scale-110 hover:shadow-lg`
                  } rounded-lg p-2`}
              >
                <div
                  className={`p-1 bg-gradient-to-r rounded-full ${card.gradient}`}
                >
                  {card.icon}
                </div>
                <div>
                  <h2 className="text-sm font-semibold mb-1 mr-2">
                    {card.title}
                  </h2>
                  <div className="text-sm font-bold mr-2">{card.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Activities Table Section */}
          {!!loggedUser?.isAdmin && (
            <div
              className={`border-2 ${
                selectedCard === "Delayed"
                  ? "border-red-800"
                  : selectedCard === "On Track"
                  ? "border-green-800"
                  : selectedCard === "New"
                  ? "border-blue-800"
                  : selectedCard === "In Progress"
                  ? "border-yellow-800"
                  : selectedCard === "Completed"
                  ? "border-green-800"
                  : "border-red-800"
              } border-l-8 rounded-4xl shadow-md hover:shadow-2xl transition-shadow mt-8 bg-white p-4`}
            >
              {selectedCard === "Delayed" ? (
                <>
                  <div className="flex bg-gradient-to-r from-red-200 to-red-100 rounded-4xl p-2 items-center gap-2 mb-4">
                    <AlertCircle className="text-red-500" />
                    <h2 className="text-xl font-bold">Delayed Activities</h2>
                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {delayedCount} {delayedCount === 1 ? "item" : "items"}
                    </span>
                  </div>

                  {delayedActivities.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto overflow-x-auto">
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
                              Track
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Target Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Delayed Days
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {delayedActivities.map((activity) => (
                            <tr
                              key={activity.ActivityId}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {activity.ActivityName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  {activity.Status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <ActivityInfo activity={activity} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center">
                                  <CalendarClock className="mr-1 h-4 w-4 text-red-500" />
                                  {new Date(
                                    activity.TargetDate
                                  ).toLocaleDateString("en-IN")}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  {activity.DelayedDays} Days Delay
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CircleCheckBig className="mx-auto h-12 w-12 text-green-500" />
                      <p className="mt-2">No delayed activities found</p>
                    </div>
                  )}
                </>
              ) : selectedCard === "On Track" ? (
                <>
                  <div className="flex bg-gradient-to-r from-green-200 to-green-100 rounded-4xl p-2 items-center gap-2 mb-4">
                    <CheckCircle className="text-green-500" />
                    <h2 className="text-xl font-bold">On Track Activities</h2>
                    <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {onTrackCount} {onTrackCount === 1 ? "item" : "items"}
                    </span>
                  </div>

                  {onTrackActivities.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto overflow-x-auto">
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
                              Track
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Target Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Days Remaining
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {onTrackActivities.map((activity) => (
                            <tr
                              key={activity.ActivityId}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {activity.ActivityName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {activity.Status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <ActivityInfo activity={activity} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center">
                                  <CalendarClock className="mr-1 h-4 w-4 text-green-500" />
                                  {new Date(
                                    activity.TargetDate
                                  ).toLocaleDateString("en-IN")}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {activity.OnTrackDaysRemaining} Days Remaining
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CircleCheckBig className="mx-auto h-12 w-12 text-green-500" />
                      <p className="mt-2">No on-track activities found</p>
                    </div>
                  )}
                </>
              ) : selectedCard === "New" ? (
                <>
                  <div className="flex bg-gradient-to-r from-blue-200 to-blue-100 rounded-4xl p-2 items-center gap-2 mb-4">
                    <CircleFadingPlus className="text-blue-500" />
                    <h2 className="text-xl font-bold">New Activities</h2>
                    <span className="ml-2 bg-green-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {statusCounts["New"] || "0 "}
                      {statusCounts["New"] === 1 ? " item" : " items"}
                    </span>
                  </div>

                  {statusCounts["New"] > 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Working
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CircleFadingPlus className="mx-auto h-12 w-12 text-blue-500" />
                      <p className="mt-2">No new activities found</p>
                    </div>
                  )}
                </>
              ) : selectedCard === "In Progress" ? (
                <>
                  <div className="flex bg-gradient-to-r from-yellow-200 to-yellow-100 rounded-4xl p-2 items-center gap-2 mb-4">
                    <Clock4 className="text-yellow-500" />
                    <h2 className="text-xl font-bold">
                      In Progress Activities
                    </h2>
                    <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {statusCounts["InProgress"] || "0 "}
                      {statusCounts["InProgress"] === 1 ? " item" : " items"}
                    </span>
                  </div>

                  {statusCounts["InProgress"] > 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Working
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Clock4 className="mx-auto h-12 w-12 text-yellow-500" />
                      <p className="mt-2">No InProgreess activities found</p>
                    </div>
                  )}
                </>
              ) : selectedCard === "Completed" ? (
                <>
                  <div className="flex bg-gradient-to-r from-green-200 to-green-100 rounded-4xl p-2 items-center gap-2 mb-4">
                    <CircleCheck className="text-green-500" />
                    <h2 className="text-xl font-bold">Completed Activities</h2>
                    <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {statusCounts["Completed"] || "0 "}
                      {statusCounts["Completed"] === 1 ? " item" : " items"}
                    </span>
                  </div>

                  {statusCounts["Completed"] > 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Working
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CircleCheck className="mx-auto h-12 w-12 text-green-500" />
                      <p className="mt-2">No Completed activities found</p>
                    </div>
                  )}
                </>
              ) : selectedCard === "Pending" ? (
                <>
                  <div className="flex bg-gradient-to-r from-red-200 to-red-100 rounded-4xl p-2 items-center gap-2 mb-4">
                    <CircleAlert className="text-red-500" />
                    <h2 className="text-xl font-bold">Pending Activities</h2>
                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {statusCounts["Rejected"] || "0 "}
                      {statusCounts["Rejected"] === 1 ? " item" : " items"}
                    </span>
                  </div>

                  {statusCounts["Rejected"] > 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Working
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CircleAlert className="mx-auto h-12 w-12 text-red-500" />
                      <p className="mt-2">No Pending activities found</p>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
