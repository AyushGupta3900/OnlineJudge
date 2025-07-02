import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCompleteOnboardingMutation } from "../redux/api/authAPI.js";
import { setCredentials } from "../redux/reducers/authReducer.js"; 
import toast from "react-hot-toast";

const useOnboarding = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [onboard, { isLoading, error }] = useCompleteOnboardingMutation();

  const submitOnboarding = async (onBoardingData) => {
    try {
      const response = await onboard(onBoardingData).unwrap();

      dispatch(setCredentials(response));

      toast.success("Onboarding completed!");
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || "Submission failed");
    }
  };

  return { submitOnboarding, isLoading, error };
};

export default useOnboarding;
