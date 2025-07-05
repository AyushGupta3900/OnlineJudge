import { useSelector, useDispatch } from "react-redux";
import { setCode, setLanguage, resetCode } from "../redux/reducers/codeReducer.js";

const useCode = () => {
  const dispatch = useDispatch();

  const code = useSelector((state) => state.code.code);
  const language = useSelector((state) => state.code.language);

  const updateCode = (newCode) => {
    dispatch(setCode(newCode));
  };

  const updateLanguage = (newLang) => {
    dispatch(setLanguage(newLang));
  };

  const reset = () => {
    dispatch(resetCode());
  };

  return {
    code,
    language,
    updateCode,
    updateLanguage,
    reset,
  };
};

export default useCode;
