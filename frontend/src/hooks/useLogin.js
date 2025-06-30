import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginUserMutation } from "../redux/api/authAPI.js";
import { setCredentials } from "../redux/reducers/authReducer.js";
import toast from "react-hot-toast";

const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginUser, { data, error, isLoading, isSuccess }] = useLoginUserMutation();

  const login = async (loginData) => {
    try {
      const response = await loginUser(loginData).unwrap();
      dispatch(setCredentials(response));
    } catch (err) {
      // error is available in `error` already
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      toast.success("Its done");
      navigate("/"); 
    }
  }, [isSuccess, data, navigate]);

  return { login, isLoading, error };
};

export default useLogin;