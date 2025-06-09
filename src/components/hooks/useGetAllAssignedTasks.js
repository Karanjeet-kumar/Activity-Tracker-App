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

  const fetchTasks = useCallback(async () => {
    if (!loggedUser || loggedUser.isAdmin) return; // Skip if admin or no user
    if (!userId) return;

    let retried = false;

    try {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        toast("Not Authenticated");
        navigate("/login");
        return;
      }

      const res = await axios.get(`${TASK_API_END_POINT}/${userId}/`);

      if (res.data.success) {
        dispatch(setAllAssignedTask(res.data.assignedTasks));
      }
    } catch (error) {
      if (error.response?.status === 401 && !retried) {
        retried = true;
        const refreshed = await attemptTokenRefresh(navigate);
        if (refreshed) return fetchTasks(); // retry after refresh
      } else {
        toast("Failed to fetch Assigned Tasks");
        console.error("Fetch error:", error);
      }
    }
  }, [dispatch, navigate, userId, loggedUser]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { refresh: fetchTasks };
}
