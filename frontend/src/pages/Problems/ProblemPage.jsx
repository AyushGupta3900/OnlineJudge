import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BiSolidLeftArrow, BiSolidDownArrow } from "react-icons/bi";
import { useGetProblemByIdQuery } from "../../redux/api/problemAPI";
import useAuthUser from "../../hooks/useAuthUser";
import CodeEditor from "../../components/CodeEditor";

const ProblemPage = () => {
  const { id } = useParams();
  const [viewMode, setViewMode] = useState("side");

  const { data, isLoading, isError } = useGetProblemByIdQuery(id);
  const problem = data?.data;

  const { authUser } = useAuthUser();
  const solvedProblemIds = authUser?.solvedProblems?.map((p) => p.toString()) || [];
  const isSolved = problem && solvedProblemIds.includes(problem._id);

  if (isLoading) return <LoadingState />;
  if (isError || !problem) return <ErrorState />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 text-white min-h-screen px-4 py-6"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-[1600px] mx-auto"
      >
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />

        {viewMode === "side" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProblemContent problem={problem} isSolved={isSolved} />
            <EditorPanel />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <ProblemContent problem={problem} isSolved={isSolved} />
            <EditorPanel />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProblemPage;

const LoadingState = () => (
  <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
    <p className="text-lg text-gray-400 animate-pulse">Loading problem...</p>
  </div>
);

const ErrorState = () => (
  <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
    <p className="text-lg text-red-500">Failed to load problem.</p>
  </div>
);

const ViewToggle = ({ viewMode, setViewMode }) => (
  <div className="hidden lg:flex justify-end mb-4">
    <button
      onClick={() => setViewMode(viewMode === "side" ? "bottom" : "side")}
      className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium px-4 py-2 rounded-md border border-gray-700 flex items-center gap-2 transition cursor-pointer"
    >
      {viewMode === "side" ? (
        <>
          <BiSolidDownArrow className="text-lg" />
          Move Editor to Bottom
        </>
      ) : (
        <>
          <BiSolidLeftArrow className="text-lg" />
          Move Editor to Side
        </>
      )}
    </button>
  </div>
);

const EditorPanel = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    className="overflow-y-auto max-h-[calc(150vh-3rem)]"
  >
    <CodeEditor />
  </motion.div>
);

const ProblemContent = ({ problem, isSolved }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="space-y-6 overflow-y-auto max-h-[calc(150vh-3rem)] pr-2"
  >
    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
      {problem.title}
    </h1>

    <TagsAndDifficulty problem={problem} />

    <Section title="📝 Description" content={problem.description} />

    {problem.constraints?.length > 0 && (
      <ListSection title="📌 Constraints" items={problem.constraints} />
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {problem.inputFormat?.length > 0 && (
        <ListSection title="🔽 Input Format" items={problem.inputFormat} />
      )}
      {problem.outputFormat?.length > 0 && (
        <ListSection title="🔼 Output Format" items={problem.outputFormat} />
      )}
    </div>

    <SampleTestCases testCases={problem.sampleTestCases} />

    <SolvedState isSolved={isSolved} problemId={problem._id} />
  </motion.div>
);

const TagsAndDifficulty = ({ problem }) => (
  <div className="flex flex-wrap items-center gap-3">
    <span
      className={`px-3 py-1 text-sm font-semibold rounded-full shadow ${
        problem.difficulty === "Easy"
          ? "bg-green-600"
          : problem.difficulty === "Medium"
          ? "bg-yellow-500"
          : "bg-red-600"
      }`}
    >
      {problem.difficulty}
    </span>
    {problem.tags.map((tag, i) => (
      <span
        key={i}
        className="bg-gray-800 text-xs px-3 py-1 rounded-full text-gray-300 border border-gray-700"
      >
        #{tag}
      </span>
    ))}
  </div>
);

const Section = ({ title, content }) => (
  <section>
    <h2 className="text-2xl font-semibold mb-2">{title}</h2>
    <p className="text-gray-300 leading-relaxed whitespace-pre-line">{content}</p>
  </section>
);

const ListSection = ({ title, items }) => (
  <section>
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <ul className="bg-gray-800 p-4 rounded-md text-sm text-gray-200 space-y-1 list-disc pl-6">
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  </section>
);

const SampleTestCases = ({ testCases }) => (
  <section>
    <h2 className="text-xl font-semibold mb-4">🧪 Sample Test Cases</h2>
    <div className="space-y-4">
      {testCases.map((test, index) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          key={index}
          className="bg-gray-800 p-4 rounded-md space-y-1 border border-gray-700"
        >
          <p className="text-sm text-gray-400">Test Case {index + 1}</p>
          <p>
            <span className="text-blue-400 font-medium">Input:</span> {test.input}
          </p>
          <p>
            <span className="text-green-400 font-medium">Output:</span> {test.output}
          </p>
          <p>
            <span className="text-yellow-400 font-medium">Explanation:</span>{" "}
            {test.explanation}
          </p>
        </motion.div>
      ))}
    </div>
  </section>
);

const SolvedState = ({ isSolved, problemId }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-4">
    <div className="text-sm font-medium">
      {isSolved ? (
        <span className="text-green-400">✅ You have solved this problem</span>
      ) : (
        <span className="text-gray-400">🕒 Not Solved Yet</span>
      )}
    </div>

    <Link
      to={`/submissions/problem/${problemId}`}
      className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-md"
    >
      📄 View Your Submissions
    </Link>
  </div>
);
