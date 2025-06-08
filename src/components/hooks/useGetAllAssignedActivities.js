import { useEffect } from "react";
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

        const res = await axios.get(`${TRN_ACTIVITY_API_END_POINT}/${userId}/`);

        if (res.data.success) {
          dispatch(setAllAssignedActivity(res.data.assignedActivities));
        }
      } catch (error) {
        if (error.response?.status === 401 && !retried) {
          retried = true;
          const refreshed = await attemptTokenRefresh(navigate);
          if (refreshed) return fetchActivities(); // retry after refresh
        } else {
          toast("Failed to fetch Assigned Activities");
          console.error("Fetch error:", error);
        }
      }
    };

    fetchActivities();
  }, []);
};

export default useGetAllAssignedActivities;
