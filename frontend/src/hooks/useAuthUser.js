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
    refetch, 
  } = useGetAuthUserQuery(undefined, {
    refetchOnMountOrArgChange: true, 
  });

  const authUser = data?.user || null;

  useEffect(() => {
    if (authUser) {
      dispatch(setCredentials({ user: authUser, token: null }));
    }
  }, [authUser, dispatch]);

  return {
    authUser,
    isLoading,
    isError,
    error,
    refetch, 
  };
};

export default useAuthUser;
