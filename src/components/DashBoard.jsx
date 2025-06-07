import { useState } from "react";
import Navbar from "./shared/Navbar";
import {
  CalendarClock,
  CircleAlert,
  CircleCheckBig,
  Clock4,
  LayoutDashboard,
} from "lucide-react";

function Dashboard() {
  const [selectedCard, setSelectedCard] = useState("Total Tasks");

  const cards = [
    {
      title: "Total Tasks",
      value: "3",
      gradient: "from-blue-500 to-blue-200",
      border: "border-blue-800",
      icon: <CalendarClock size={40} />,
    },
    {
      title: "In Progress",
      value: "1",
      gradient: "from-yellow-500 to-yellow-200",
      border: "border-yellow-800",
      icon: <Clock4 size={40} />,
    },
    {
      title: "Completed",
      value: "1",
      gradient: "from-green-500 to-green-200",
      border: "border-green-800",
      icon: <CircleCheckBig size={40} />,
    },
    {
      title: "Pending",
      value: "1",
      gradient: "from-red-500 to-red-200",
      border: "border-red-800",
      icon: <CircleAlert size={40} />,
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-blue-200 rounded-md p-1">
              <LayoutDashboard size={30} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">DashBoard</h1>
              <h1 className="text-1xl text-gray-400 font-bold">
                Monday, May 19, 2025
              </h1>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {cards.map((card) => (
              <div
                key={card.title}
                onClick={() => setSelectedCard(card.title)}
                className={`flex justify-between items-center cursor-pointer transform transition-all duration-200 
                  bg-gradient-to-r ${card.gradient} ${card.border}
                  ${
                    selectedCard === card.title
                      ? "border-2 scale-105 shadow-xl"
                      : "border hover:scale-105 hover:shadow-md"
                  } rounded-lg p-4`}
              >
                <div className="ml-2">{card.icon}</div>
                <div>
                  <h2 className="text-xl font-semibold mb-1 mr-4">
                    {card.title}
                  </h2>
                  <div className="text-xl font-bold mr-4">{card.value}</div>
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
