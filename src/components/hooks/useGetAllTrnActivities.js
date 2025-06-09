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

  const fetchActivities = useCallback(async () => {
    if (!loggedUser?.isAdmin) return; // Skip if not admin
    let retried = false;

    // API(GetAll_TRN_ACTIVITY_API)--->Connected
    try {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        toast("Not Authenticated");
        navigate("/login");
        return;
      }

      const res = await axios.get(`${TRN_ACTIVITY_API_END_POINT}/`);

      if (res.data.success) {
        dispatch(setAllTrnActivity(res.data.trnActivities));
      }
    } catch (error) {
      if (error.response?.status === 401 && !retried) {
        retried = true;
        const refreshed = await attemptTokenRefresh(navigate);
        if (refreshed) return fetchActivities(); // retry after refresh
      } else {
        toast("Failed to fetch TrnActivities");
        console.error("Fetch error:", error);
      }
    }
  }, [dispatch, navigate]);

  // Add useEffect to run on mount
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Return the refresh function
  return { refresh: fetchActivities };
};

export default useGetAllTrnActivities;
