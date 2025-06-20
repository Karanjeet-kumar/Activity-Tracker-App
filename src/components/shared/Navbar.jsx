import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useNav } from "../context/NavContext";

const Navbar = () => {
  const { toggleNav, isNavVisible } = useNav(); // Get toggle function from context

  return (
    <div className="bg-gradient-to-b from-blue-300 to-blue-700 text-white sticky top-0 z-50">
      <div className="flex items-center justify-between mx-4 max-w-7xl h-16">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={toggleNav}
              >
                <img
                  src="/app_logo.png"
                  alt="logo"
                  style={{
                    borderRadius: "20%",
                    width: "50px",
                    height: "50px",
                  }}
                />
                <h1 className="text-2xl font-bold">
                  Activity<span className="text-[#36efef]">Tracker</span>
                </h1>
              </div>
            </TooltipTrigger>
            <TooltipContent className="opacity-50" side="right">
              {isNavVisible ? "Close Sidebar" : "Open Sidebar"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Navbar;
