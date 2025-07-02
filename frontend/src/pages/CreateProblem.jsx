import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProblemMutation } from "../redux/api/problemAPI";
import { FiX } from "react-icons/fi";

const CreateProblem = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [tags, setTags] = useState("");

  const [constraints, setConstraints] = useState([""]);
  const [inputFormat, setInputFormat] = useState([""]);
  const [outputFormat, setOutputFormat] = useState([""]);

  const [timeLimit, setTimeLimit] = useState(1);
  const [memoryLimit, setMemoryLimit] = useState(256);

  const [sampleTestCases, setSampleTestCases] = useState([
    { input: "", output: "", explanation: "" },
  ]);
  const [hiddenTestCases, setHiddenTestCases] = useState([
    { input: "", output: "" },
  ]);

  const [createProblem, { isLoading }] = useCreateProblemMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problem = {
      title,
      description,
      difficulty,
      tags: tags.split(",").map((tag) => tag.trim()),
      constraints: constraints.filter((c) => c.trim() !== ""),
      inputFormat: inputFormat.filter((c) => c.trim() !== ""),
      outputFormat: outputFormat.filter((c) => c.trim() !== ""),
      timeLimit,
      memoryLimit,
      sampleTestCases,
      hiddenTestCases,
    };

    try {
      await createProblem(problem).unwrap();
      navigate("/admin");
    } catch (err) {
      console.error("Error creating problem:", err);
    }
  };

  const renderDynamicField = (label, values, setValues) => (
    <div>
      <label className="block text-sm font-semibold mb-2">{label}</label>
      {values.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const updated = [...values];
              updated[idx] = e.target.value;
              setValues(updated);
            }}
            className="flex-1 bg-gray-800 border border-gray-700 px-3 py-2 rounded-md"
          />
          {values.length > 1 && (
            <button
              type="button"
              onClick={() => setValues(values.filter((_, i) => i !== idx))}
              className="text-red-500 hover:text-red-400 transition cursor-pointer"
              title="Remove"
            >
              <FiX size={20} />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => setValues([...values, ""])}
        className="mt-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md cursor-pointer"
      >
        + Add {label}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-4xl mx-auto bg-gray-900 p-6 rounded-xl border border-gray-800 shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">📝 Create New Problem</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title, Description, Difficulty, Tags */}
          <div>
            <label className="block text-sm font-semibold mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md"
            />
          </div>

          {/* Constraints, Input Format, Output Format */}
          {renderDynamicField("Constraints", constraints, setConstraints)}
          {renderDynamicField("Input Format", inputFormat, setInputFormat)}
          {renderDynamicField("Output Format", outputFormat, setOutputFormat)}

          {/* Time & Memory Limit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Time Limit (s)</label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Memory Limit (MB)</label>
              <input
                type="number"
                value={memoryLimit}
                onChange={(e) => setMemoryLimit(Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md"
              />
            </div>
          </div>

          {/* Sample Test Cases */}
          <div>
            <label className="block text-sm font-semibold mb-2">Sample Test Cases</label>
            {sampleTestCases.map((tc, index) => (
              <div key={index} className="relative border border-gray-700 rounded-md p-4 mb-4 bg-gray-800">
                <button
                  type="button"
                  onClick={() =>
                    setSampleTestCases(sampleTestCases.filter((_, i) => i !== index))
                  }
                  className="absolute top-2 right-2 text-red-500 hover:text-red-400 cursor-pointer"
                  title="Remove Sample Test Case"
                >
                  <FiX size={18} />
                </button>
                <textarea
                  placeholder="Input"
                  value={tc.input}
                  onChange={(e) => {
                    const updated = [...sampleTestCases];
                    updated[index].input = e.target.value;
                    setSampleTestCases(updated);
                  }}
                  required
                  rows={3}
                  className="w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded-md resize-y mb-2"
                />
                <textarea
                  placeholder="Output"
                  value={tc.output}
                  onChange={(e) => {
                    const updated = [...sampleTestCases];
                    updated[index].output = e.target.value;
                    setSampleTestCases(updated);
                  }}
                  required
                  rows={3}
                  className="w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded-md resize-y mb-2"
                />
                <textarea
                  placeholder="Explanation"
                  value={tc.explanation}
                  onChange={(e) => {
                    const updated = [...sampleTestCases];
                    updated[index].explanation = e.target.value;
                    setSampleTestCases(updated);
                  }}
                  rows={2}
                  className="w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded-md resize-y"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setSampleTestCases([
                  ...sampleTestCases,
                  { input: "", output: "", explanation: "" },
                ])
              }
              className="mt-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md cursor-pointer"
            >
              + Add Sample Test Case
            </button>
          </div>

          {/* Hidden Test Cases */}
          <div>
            <label className="block text-sm font-semibold mb-2">Hidden Test Cases</label>
            {hiddenTestCases.map((tc, index) => (
              <div key={index} className="relative border border-gray-700 rounded-md p-4 mb-4 bg-gray-800">
                <button
                  type="button"
                  onClick={() =>
                    setHiddenTestCases(hiddenTestCases.filter((_, i) => i !== index))
                  }
                  className="absolute top-2 right-2 text-red-500 hover:text-red-400 cursor-pointer"
                  title="Remove Hidden Test Case"
                >
                  <FiX size={18} />
                </button>
                <textarea
                  placeholder="Input"
                  value={tc.input}
                  onChange={(e) => {
                    const updated = [...hiddenTestCases];
                    updated[index].input = e.target.value;
                    setHiddenTestCases(updated);
                  }}
                  required
                  rows={3}
                  className="w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded-md resize-y mb-2"
                />
                <textarea
                  placeholder="Output"
                  value={tc.output}
                  onChange={(e) => {
                    const updated = [...hiddenTestCases];
                    updated[index].output = e.target.value;
                    setHiddenTestCases(updated);
                  }}
                  required
                  rows={3}
                  className="w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded-md resize-y"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setHiddenTestCases([...hiddenTestCases, { input: "", output: "" }])
              }
              className="mt-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md cursor-pointer"
            >
              + Add Hidden Test Case
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md font-semibold cursor-pointer"
          >
            {isLoading ? "Creating..." : "Create Problem"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProblem;
