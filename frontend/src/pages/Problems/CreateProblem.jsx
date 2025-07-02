import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProblemMutation } from "../../redux/api/problemAPI";
import { FiX } from "react-icons/fi";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { staggerChildren: 0.1, when: "beforeChildren" }
  },
};

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

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
    <motion.div variants={fieldVariants} className="mb-6">
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
            <motion.button
              type="button"
              onClick={() => setValues(values.filter((_, i) => i !== idx))}
              className="text-red-500 hover:text-red-400 transition cursor-pointer"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX size={20} />
            </motion.button>
          )}
        </div>
      ))}
      <motion.button
        type="button"
        onClick={() => setValues([...values, ""])}
        className="mt-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md cursor-pointer"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        + Add {label}
      </motion.button>
    </motion.div>
  );

  return (
    <motion.div
      className="min-h-screen bg-gray-950 text-white px-4 py-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="max-w-4xl mx-auto bg-gray-900 p-6 rounded-xl border border-gray-800 shadow"
        variants={fieldVariants}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">📝 Create New Problem</h2>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          variants={containerVariants}
        >
          {/* Title */}
          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-semibold mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md"
            />
          </motion.div>

          {/* Description */}
          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md resize-y"
            />
          </motion.div>

          {/* Difficulty & Tags */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            variants={fieldVariants}
          >
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
          </motion.div>

          {/* Dynamic Fields */}
          {renderDynamicField("Constraints", constraints, setConstraints)}
          {renderDynamicField("Input Format", inputFormat, setInputFormat)}
          {renderDynamicField("Output Format", outputFormat, setOutputFormat)}

          {/* Time & Memory Limits */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={fieldVariants}
          >
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
          </motion.div>

          {/* Sample Test Cases */}
          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-semibold mb-2">Sample Test Cases</label>
            {sampleTestCases.map((tc, index) => (
              <motion.div
                key={index}
                className="relative border border-gray-700 rounded-md p-4 mb-4 bg-gray-800"
                variants={fieldVariants}
              >
                <motion.button
                  type="button"
                  onClick={() =>
                    setSampleTestCases(sampleTestCases.filter((_, i) => i !== index))
                  }
                  className="absolute top-2 right-2 text-red-500 hover:text-red-400 cursor-pointer"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX size={18} />
                </motion.button>
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
              </motion.div>
            ))}
            <motion.button
              type="button"
              onClick={() =>
                setSampleTestCases([
                  ...sampleTestCases,
                  { input: "", output: "", explanation: "" },
                ])
              }
              className="mt-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md cursor-pointer"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              + Add Sample Test Case
            </motion.button>
          </motion.div>

          {/* Hidden Test Cases */}
          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-semibold mb-2">Hidden Test Cases</label>
            {hiddenTestCases.map((tc, index) => (
              <motion.div
                key={index}
                className="relative border border-gray-700 rounded-md p-4 mb-4 bg-gray-800"
                variants={fieldVariants}
              >
                <motion.button
                  type="button"
                  onClick={() =>
                    setHiddenTestCases(hiddenTestCases.filter((_, i) => i !== index))
                  }
                  className="absolute top-2 right-2 text-red-500 hover:text-red-400 cursor-pointer"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX size={18} />
                </motion.button>
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
              </motion.div>
            ))}
            <motion.button
              type="button"
              onClick={() =>
                setHiddenTestCases([...hiddenTestCases, { input: "", output: "" }])
              }
              className="mt-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md cursor-pointer"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              + Add Hidden Test Case
            </motion.button>
          </motion.div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md font-semibold cursor-pointer"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {isLoading ? "Creating..." : "Create Problem"}
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default CreateProblem;
