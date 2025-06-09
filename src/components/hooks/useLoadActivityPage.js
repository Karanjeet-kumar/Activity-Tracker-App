import useGetAllTrnActivities from "./useGetAllTrnActivities";
import useGetAllAssignedActivities from "./useGetAllAssignedActivities";
import { useSelector } from "react-redux";

export default function useLoadActivityPage() {
  const { loggedUser } = useSelector((store) => store.auth);
  const isAdmin = loggedUser?.isAdmin;

  // Call both hooks unconditionally
  const trnHook = useGetAllTrnActivities();
  const assignedHook = useGetAllAssignedActivities();

  // Conditionally return the appropriate hook result
  return isAdmin ? trnHook : assignedHook;
}
