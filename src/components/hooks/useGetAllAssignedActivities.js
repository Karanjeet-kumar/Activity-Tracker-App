import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import { attemptTokenRefresh } from "../utils/refreshToken";
import { TRN_ACTIVITY_API_END_POINT } from "../utils/api_const";
import { setAllAssignedActivity } from "../redux/activitySlice";

const useGetAllAssignedActivities = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedUser } = useSelector((store) => store.auth);
  const userId = loggedUser?.user_id;

  const fetchActivities = useCallback(
    async (activityName = "", status = "") => {
      if (!loggedUser || loggedUser.isAdmin) return; // Skip if admin or no user
      if (!userId) return;

      let retried = false;

      // API(GetAllAssigned_ACTIVITY_API)--->Connected
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
        if (status) queryParams.append("status", status);

        const res = await axios.get(
          `${TRN_ACTIVITY_API_END_POINT}/user/${userId}/?${queryParams.toString()}`
        );

        if (res.data.success) {
          dispatch(setAllAssignedActivity(res.data.assignedActivities));
        }
      } catch (error) {
        if (error.response?.status === 401 && !retried) {
          retried = true;
          const refreshed = await attemptTokenRefresh(navigate);
          if (refreshed) return fetchActivities(activityName, status);
        } else {
          toast("Failed to fetch Assigned Activities");
          console.error("Fetch error:", error);
        }
      }
    },
    [dispatch, navigate, userId]
  );

  // Add useEffect to run on mount
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Return the refresh function
  return { refresh: fetchActivities };
};

export default useGetAllAssignedActivities;
