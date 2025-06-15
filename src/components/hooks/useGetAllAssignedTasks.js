import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import { attemptTokenRefresh } from "../utils/refreshToken";
import { TASK_API_END_POINT } from "../utils/api_const";
import { setAllAssignedTask } from "../redux/taskSlice";

export default function useLoadTaskPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedUser } = useSelector((store) => store.auth);
  const userId = loggedUser?.user_id;

  const fetchTasks = useCallback(
    async (taskName = "", status = "") => {
      if (!loggedUser || loggedUser.isAdmin) return; // Skip if admin or no user
      if (!userId) return;

      let retried = false;

      // API(GetAllAssigned_TASK_API)--->Connected
      try {
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
          toast("Not Authenticated");
          navigate("/login");
          return;
        }

        // Prepare query params
        const queryParams = new URLSearchParams();
        if (taskName) queryParams.append("task_name", taskName);
        if (status) queryParams.append("status", status);

        const res = await axios.get(
          `${TASK_API_END_POINT}/${userId}/?${queryParams.toString()}`
        );

        if (res.data.success) {
          dispatch(setAllAssignedTask(res.data.assignedTasks));
        }
      } catch (error) {
        if (error.response?.status === 401 && !retried) {
          retried = true;
          const refreshed = await attemptTokenRefresh(navigate);
          if (refreshed) return fetchTasks(taskName, status);
        } else {
          toast("Failed to fetch Assigned Tasks");
          console.error("Fetch error:", error);
        }
      }
    },
    [dispatch, navigate, userId]
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { refresh: fetchTasks };
}
