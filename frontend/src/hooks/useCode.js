import { useSelector, useDispatch } from "react-redux";
import { setCode, setLanguage, resetCode } from "../redux/reducers/codeReducer.js";

const useCode = (problemId) => {
  const dispatch = useDispatch();

  const problemState = useSelector(
    (state) => state.code.problems[problemId] || { code: "", language: "cpp" }
  );

  const updateCode = (newCode) => {
    dispatch(setCode({ problemId, code: newCode }));
  };

  const updateLanguage = (newLang) => {
    dispatch(setLanguage({ problemId, language: newLang }));
  };

  const reset = () => {
    dispatch(resetCode({ problemId }));
  };

  return {
    code: problemState.code,
    language: problemState.language,
    updateCode,
    updateLanguage,
    reset,
  };
};

export default useCode;
