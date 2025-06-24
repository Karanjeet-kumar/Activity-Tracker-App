import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import { attemptTokenRefresh } from "../utils/refreshToken";
import { TRN_ACTIVITY_API_END_POINT } from "../utils/api_const";
import { setAllTrnActivity } from "../redux/activitySlice";

const useGetAllTrnActivities = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedUser } = useSelector((store) => store.auth);
  const adminId = loggedUser?.user_id;

  const fetchActivities = useCallback(
    async (activityName = "", status = "") => {
      if (!loggedUser?.isAdmin) return;
      if (!adminId) return;
      let retried = false;

      // API(GetAll_TRN_ACTIVITY_API)--->Connected
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
          `${TRN_ACTIVITY_API_END_POINT}/admin/${adminId}/?${queryParams.toString()}`
        );

        if (res.data.success) {
          dispatch(setAllTrnActivity(res.data.trnActivities));
        }
      } catch (error) {
        if (error.response?.status === 401 && !retried) {
          retried = true;
          const refreshed = await attemptTokenRefresh(navigate);
          if (refreshed) return fetchActivities(activityName, status);
        } else {
          toast("Failed to fetch TrnActivities");
          console.error("Fetch error:", error);
        }
      }
    },
    [dispatch, navigate, adminId]
  );

  // Add useEffect to run on mount
  useEffect(() => {
    fetchActivities(); // initial fetch without filters
  }, [fetchActivities]);

  // Return the refresh function
  return { refresh: fetchActivities };
};

export default useGetAllTrnActivities;
