import { useGetAuthUserQuery } from "../redux/api/authAPI.js";
import { setCredentials } from "../redux/reducers/authReducer.js";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useAuthUser = () => {
  const dispatch = useDispatch();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetAuthUserQuery();

  const authUser = data?.user || null;

  useEffect(() => {
    if (authUser) {
      dispatch(setCredentials({ user: authUser, token: null }));
    }
  }, [authUser, dispatch]);

  return { authUser, isLoading, isError, error };
};

export default useAuthUser;