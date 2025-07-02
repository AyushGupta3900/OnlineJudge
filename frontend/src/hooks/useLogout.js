import { useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "../redux/api/authAPI.js";
import { useDispatch } from "react-redux";
import { logout as clearCredentials } from "../redux/reducers/authReducer.js";
import toast from "react-hot-toast";
import { persistor } from "../redux/store/store.js"; 

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();

  const logout = async () => {
    try {
      await logoutUser().unwrap(); 
    } catch (error) {
      console.warn("Server logout failed, proceeding to clear local state anyway");
    }
    dispatch(clearCredentials());
    await persistor.purge(); 

    toast.success("Logout successful!");
    navigate("/login");
  };

  return { logout, isLoading };
};

export default useLogout;
