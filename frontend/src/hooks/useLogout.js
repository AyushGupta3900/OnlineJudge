// src/hooks/useLogout.js
import { useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "../redux/api/authAPI.js";
import { useDispatch } from "react-redux";
import { logout as clearCredentials } from "../redux/reducers/authReducer.js";
import toast from "react-hot-toast";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();

  const logout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(clearCredentials());
      toast.success("Logout successful!");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  return { logout, isLoading };
};

export default useLogout;