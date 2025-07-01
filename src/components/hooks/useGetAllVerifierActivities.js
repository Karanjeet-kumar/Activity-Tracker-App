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

  const fetchActivities = useCallback(
    async (activityName = "", status = "") => {
      if (!loggedUser || loggedUser.isAdmin) return; // Skip if admin or no user
      if (!userId) return;

      let retried = false;

      // API(GetAllVerifierActivities_API)--->Connected
      try {
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
          toast("Not Authenticated");
          navigate("/login");
          return;
        }

        // Prepare query params
        const queryParams = new URLSearchParams();
        if (activityName) queryParams.append("activity_name", activityName);
        if (status !== undefined && status !== null && status !== "") {
          queryParams.append("status", status);
        }

        const res = await axios.get(
          `${VERIFIER_API_END_POINT}/activities/${userId}/?${queryParams.toString()}`
        );

        if (res.data.success) {
          dispatch(setAllVerifierActivity(res.data.activities));
        }
      } catch (error) {
        if (error.response?.status === 401 && !retried) {
          retried = true;
          const refreshed = await attemptTokenRefresh(navigate);
          if (refreshed) return fetchActivities(activityName, status);
        } else {
          toast("Failed to fetch Verifier Activities");
          console.error("Fetch error:", error);
        }
      }
    },
    [dispatch, navigate, userId]
  );

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { refresh: fetchActivities };
}
