import { useSignupUserMutation } from "../redux/api/authAPI.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useSignup = () => {
  const [signupUser, { isLoading, error }] = useSignupUserMutation();
  const navigate = useNavigate();

  const signup = async (signupData) => {
    try {
      await signupUser(signupData).unwrap();
      toast.success("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message || "Signup failed");
    }
  };

  return { signup, isLoading, error };
};

export default useSignup;