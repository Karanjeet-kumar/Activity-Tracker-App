import axios from "axios";
import { toast } from "sonner";
import { REFRESH_TOKEN_API } from "./api_const";

export const attemptTokenRefresh = async (navigate) => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) throw new Error("No refresh token");

    const response = await axios.post(REFRESH_TOKEN_API, {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access;
    localStorage.setItem("access_token", newAccessToken);
    console.log("Session refreshed");
    return true;
  } catch (error) {
    console.error("Token refresh failed:", error);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    toast("Session expired, please login again");
    navigate("/login");
    return false;
  }
};
