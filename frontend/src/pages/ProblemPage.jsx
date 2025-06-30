import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import { BiSolidLeftArrow, BiSolidDownArrow } from "react-icons/bi";
import {   useGetProblemByIdQuery } from "../redux/api/problemAPI";

const ProblemPage = () => {
  const { id } = useParams();
  const [viewMode, setViewMode] = useState("side");

  const { data, isLoading, isError } =   useGetProblemByIdQuery(id);
  const problem = data?.data;

  if (isLoading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-400 animate-pulse">Loading problem...</p>
      </div>
    );
  }

  if (isError || !problem) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">Failed to load problem.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen px-4 py-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="hidden lg:flex justify-end mb-4">
          <button
            onClick={() => setViewMode(viewMode === "side" ? "bottom" : "side")}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium px-4 py-2 rounded-md border border-gray-700 flex items-center gap-2 transition"
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

        {viewMode === "side" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LeftPanel problem={problem} />
            <RightPanel />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <LeftPanel problem={problem} />
            <RightPanel />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemPage;

// Subcomponents
const LeftPanel = ({ problem }) => (
  <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-3rem)] pr-2">
    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
      {problem.title}
    </h1>

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

    <section>
      <h2 className="text-2xl font-semibold mb-2">📝 Description</h2>
      <p className="text-gray-300 leading-relaxed whitespace-pre-line">
        {problem.description}
      </p>
    </section>

    {problem.constraints && (
      <section>
        <h2 className="text-xl font-semibold mb-2">📌 Constraints</h2>
        <pre className="bg-gray-800 p-4 rounded-md text-sm text-gray-200 whitespace-pre-wrap">
          {problem.constraints}
        </pre>
      </section>
    )}

    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">🔽 Input Format</h2>
        <div className="bg-gray-800 p-4 rounded-md text-sm text-gray-300 whitespace-pre-wrap">
          {problem.inputFormat}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">🔼 Output Format</h2>
        <div className="bg-gray-800 p-4 rounded-md text-sm text-gray-300 whitespace-pre-wrap">
          {problem.outputFormat}
        </div>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-semibold mb-4">🧪 Sample Test Cases</h2>
      <div className="space-y-4">
        {problem.sampleTestCases.map((test, index) => (
          <div
            key={index}
            className="bg-gray-800 p-4 rounded-md space-y-1 border border-gray-700"
          >
            <p className="text-sm text-gray-400">Test Case {index + 1}</p>
            <p>
              <span className="text-blue-400 font-medium">Input:</span>{" "}
              {test.input}
            </p>
            <p>
              <span className="text-green-400 font-medium">Output:</span>{" "}
              {test.output}
            </p>
            <p>
              <span className="text-yellow-400 font-medium">Explanation:</span>{" "}
              {test.explanation}
            </p>
          </div>
        ))}
      </div>
    </section>

    <div className="text-sm font-medium mt-4">
      {problem.status === "solved" ? (
        <span className="text-green-400">✅ You have solved this problem</span>
      ) : (
        <span className="text-gray-400">🕒 Not Solved Yet</span>
      )}
    </div>
  </div>
);

const RightPanel = () => (
  <div className="overflow-y-auto max-h-[calc(100vh-3rem)]">
    <CodeEditor />
  </div>
);
