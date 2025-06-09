import "./App.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Login from "./components/auth/Login";
import DashBoard from "./components/DashBoard";
import ActivityPage from "./components/ActivityPage";
import MyTaskPage from "./components/MyTaskPage";

const appRouter = createBrowserRouter([
  // Client Side
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <DashBoard />,
  },
  {
    path: "/activities",
    element: <ActivityPage />,
  },
  {
    path: "/tasks",
    element: <MyTaskPage />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;
