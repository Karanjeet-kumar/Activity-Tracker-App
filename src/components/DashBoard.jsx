import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./shared/Navbar";
import Nav from "./shared/Nav";
import {
  CalendarClock,
  CircleAlert,
  CircleCheckBig,
  Clock4,
  LayoutDashboard,
} from "lucide-react";
import { useNav } from "./context/NavContext";
import { ACTIVITY_STATUS_COUNT_API_END_POINT } from "./utils/api_const";
import { useSelector } from "react-redux";

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

  const [statusCounts, setStatusCounts] = useState({});
  const [delayedCount, setDelayedCount] = useState(0);
  const [onTrackCount, setOnTrackCount] = useState(0);

  const [selectedCard, setSelectedCard] = useState("Total Tasks");

  useEffect(() => {
    const fetchStatusCounts = async () => {
      // API(ACTIVITY_STATUS_COUNT_API_END_POINT)--->Connected
      try {
        const response = await axios.get(
          `${ACTIVITY_STATUS_COUNT_API_END_POINT}/${loggedUser?.user_id}/`
        );
        setStatusCounts(response.data.status_wise_counts || {});
        setDelayedCount(response.data.delayed_activity_count || 0);
        setOnTrackCount(response.data.onTrack_activity_count || 0);
      } catch (error) {
        console.error("Failed to fetch status counts:", error);
      }
    };

    fetchStatusCounts();
  }, []);

  const cards = [
    {
      title: "On Track",
      value: onTrackCount,
      gradient: "from-blue-200 to-blue-100",
      border: "border-blue-800",
      icon: <CalendarClock size={30} />,
    },
    {
      title: "Delayed",
      value: delayedCount,
      gradient: "from-red-200 to-red-100",
      border: "border-red-800",
      icon: <CalendarClock size={30} />,
    },
    {
      title: "New",
      value: statusCounts["New"] || 0,
      gradient: "from-blue-200 to-blue-100",
      border: "border-blue-800",
      icon: <CalendarClock size={30} />,
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
      icon: <CircleCheckBig size={30} />,
    },
    {
      title: "Pending",
      value: statusCounts["Rejected"] || 0,
      gradient: "from-red-200 to-red-100",
      border: "border-red-800",
      icon: <CircleAlert size={30} />,
    },
  ];

  if (!loggedUser) {
    return (
      <div>
        <Navbar />
        <div className="flex h-screen">
          <Nav />
          <div className="flex-1 overflow-auto p-6">
            <div className="flex items-center justify-center max-h-[300px] h-[300px]">
              <div className="flex flex-col items-center space-y-3">
                <div className="border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                <p className="text-muted-foreground">Loading dashboard...</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
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
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
