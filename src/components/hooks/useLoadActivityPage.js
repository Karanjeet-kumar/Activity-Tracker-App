import useGetAllTrnActivities from "./useGetAllTrnActivities";
import useGetAllAssignedActivities from "./useGetAllAssignedActivities";
import { useSelector } from "react-redux";

export default function useLoadActivityPage() {
  const { loggedUser } = useSelector((store) => store.auth);

  const isAdmin = loggedUser?.isAdmin;

  if (isAdmin) {
    return useGetAllTrnActivities(); // will fetch admin activities
  } else {
    return useGetAllAssignedActivities(); // will fetch user assigned activities
  }
}
