import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import { attemptTokenRefresh } from "../utils/refreshToken";
import { TRN_ACTIVITY_API_END_POINT } from "../utils/api_const";
import { setAllTrnActivity } from "../redux/activitySlice";

const useGetAllTrnActivities = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let retried = false;

    const fetchActivities = async () => {
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
    };

    fetchActivities();
  }, []);
};

export default useGetAllTrnActivities;
