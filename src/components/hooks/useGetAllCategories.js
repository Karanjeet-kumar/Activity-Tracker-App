import axios from "axios";
import { setAllCategories } from "../redux/formSlice";
import { toast } from "sonner";
import { CATEGORY_API } from "../utils/api_const";
import { attemptTokenRefresh } from "../utils/refreshToken";

export const useGetAllCategories = async (dispatch, navigate) => {
  let retried = false;

  try {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      toast("Not Authenticated");
      navigate("/login");
      return;
    }

    const res = await axios.get(CATEGORY_API);
    if (res.data.success) {
      dispatch(setAllCategories(res.data.categories));
    }
  } catch (error) {
    if (error.response?.status === 401 && !retried) {
      retried = true;
      const refreshed = await attemptTokenRefresh(navigate);
      if (refreshed) return useGetAllCategories(dispatch, navigate);
    } else {
      console.log("API Not Connected");
      console.error("Fetch error:", error);
    }
  }
};
