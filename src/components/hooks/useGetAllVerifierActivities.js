import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import { attemptTokenRefresh } from "../utils/refreshToken";
import { VERIFIER_API_END_POINT } from "../utils/api_const";
import { setAllVerifierActivity } from "../redux/activitySlice";

export default function useLoadVerifierPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedUser } = useSelector((store) => store.auth);
  const userId = loggedUser?.user_id;

  const fetchActivities = useCallback(async () => {
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

      const res = await axios.get(
        `${VERIFIER_API_END_POINT}/activities/${userId}/`
      );

      if (res.data.success) {
        dispatch(setAllVerifierActivity(res.data.activities));
      }
    } catch (error) {
      if (error.response?.status === 401 && !retried) {
        retried = true;
        const refreshed = await attemptTokenRefresh(navigate);
        if (refreshed) return fetchActivities(); // retry after refresh
      } else {
        toast("Failed to fetch Verifier Activities");
        console.error("Fetch error:", error);
      }
    }
  }, [dispatch, navigate, userId, loggedUser]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { refresh: fetchActivities };
}
