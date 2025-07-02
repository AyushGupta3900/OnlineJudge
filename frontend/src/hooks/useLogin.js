import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginUserMutation } from "../redux/api/authAPI.js";
import { setCredentials } from "../redux/reducers/authReducer.js";
import toast from "react-hot-toast";

const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const login = async (loginData) => {
    try {
      const response = await loginUser(loginData).unwrap();
      dispatch(setCredentials(response));
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  return { login, isLoading, error };
};
export default useLogin;