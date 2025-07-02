import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetProblemByIdQuery,
  useUpdateProblemMutation,
} from "../../redux/api/problemAPI";
import toast from "react-hot-toast";
import PageLoader from "../../components/PageLoader";
import { FiX } from "react-icons/fi";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, when: "beforeChildren" },
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

const UpdateProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading: isFetching } = useGetProblemByIdQuery(id);
  const [updateProblem, { isLoading }] = useUpdateProblemMutation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    tags: "",
    constraints: [""],
    inputFormat: [""],
    outputFormat: [""],
    timeLimit: 1,
    memoryLimit: 256,
    sampleTestCases: [{ input: "", output: "", explanation: "" }],
    hiddenTestCases: [{ input: "", output: "" }],
  });

  useEffect(() => {
    if (data?.data) {
      const p = data.data;
      setFormData({
        title: p.title,
        description: p.description,
        difficulty: p.difficulty,
        tags: p.tags.join(", "),
        constraints: p.constraints || [""],
        inputFormat: p.inputFormat || [""],
        outputFormat: p.outputFormat || [""],
        timeLimit: p.timeLimit,
        memoryLimit: p.memoryLimit,
        sampleTestCases: p.sampleTestCases,
        hiddenTestCases: p.hiddenTestCases,
      });
    }
  }, [data]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleTestCaseChange = (type, index, field, value) => {
    const updated = [...formData[type]];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, [type]: updated }));
  };

  const addTestCase = (type) => {
    const newCase =
      type === "sampleTestCases"
        ? { input: "", output: "", explanation: "" }
        : { input: "", output: "" };
    setFormData((prev) => ({ ...prev, [type]: [...prev[type], newCase] }));
  };

  const removeTestCase = (type, idx) =>
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== idx),
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(",").map((t) => t.trim()),
      constraints: formData.constraints.filter((v) => v.trim()),
      inputFormat: formData.inputFormat.filter((v) => v.trim()),
      outputFormat: formData.outputFormat.filter((v) => v.trim()),
    };

    try {
      await updateProblem({ id, ...payload }).unwrap();
      toast.success("Problem updated!");
      navigate("/admin");
    } catch (err) {
      if (err.status === 403) toast.error("Unauthorized to update this problem.");
      console.error(err);
    }
  };

  if (isFetching) return <PageLoader />;

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
        <h2 className="text-2xl font-bold mb-6 text-center">✏️ Update Problem</h2>
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          variants={containerVariants}
        >
          {/* Title */}
          <motion.div variants={fieldVariants}>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md"
            />
          </motion.div>

          {/* Description */}
          <motion.div variants={fieldVariants}>
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md resize-y"
            />
          </motion.div>

          {/* Difficulty & Tags */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            variants={fieldVariants}
          >
            <div>
              <label className="block mb-1">Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md"
              />
            </div>
          </motion.div>

          {/* Dynamic Arrays */}
          {["constraints", "inputFormat", "outputFormat"].map((field) => (
            <motion.div key={field} variants={fieldVariants}>
              <label className="block mb-1 capitalize">{field}</label>
              {formData[field].map((val, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => {
                      const arr = [...formData[field]];
                      arr[i] = e.target.value;
                      setFormData((p) => ({ ...p, [field]: arr }));
                    }}
                    className="flex-1 bg-gray-800 border border-gray-700 px-3 py-2 rounded-md"
                  />
                  {formData[field].length > 1 && (
                    <motion.button
                      type="button"
                      onClick={() => {
                        const arr = formData[field].filter((_, idx2) => idx2 !== i);
                        setFormData((p) => ({ ...p, [field]: arr }));
                      }}
                      className="text-red-500 hover:text-red-400 cursor-pointer"
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
                onClick={() =>
                  setFormData((p) => ({
                    ...p,
                    [field]: [...p[field], ""],
                  }))
                }
                className="mt-1 px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm cursor-pointer"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                + Add {field}
              </motion.button>
            </motion.div>
          ))}

          {/* Time & Memory */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={fieldVariants}
          >
            <div>
              <label className="block mb-1">Time Limit (sec)</label>
              <input
                type="number"
                name="timeLimit"
                value={formData.timeLimit}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1">Memory Limit (MB)</label>
              <input
                type="number"
                name="memoryLimit"
                value={formData.memoryLimit}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md"
              />
            </div>
          </motion.div>

          {/* Sample Test Cases */}
          <motion.div variants={fieldVariants}>
            <label className="block mb-2">Sample Test Cases</label>
            {formData.sampleTestCases.map((tc, idx) => (
              <motion.div
                key={idx}
                className="relative border border-gray-700 rounded-md p-4 mb-4 bg-gray-800"
                variants={fieldVariants}
              >
                <motion.button
                  type="button"
                  onClick={() => removeTestCase("sampleTestCases", idx)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-400 cursor-pointer"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX size={18} />
                </motion.button>
                {["input", "output", "explanation"].map((f) => (
                  <textarea
                    key={f}
                    placeholder={f}
                    value={tc[f]}
                    onChange={(e) =>
                      handleTestCaseChange("sampleTestCases", idx, f, e.target.value)
                    }
                    rows={f === "explanation" ? 2 : 3}
                    className="w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded-md resize-y mb-2"
                  />
                ))}
              </motion.div>
            ))}
            <motion.button
              type="button"
              onClick={() => addTestCase("sampleTestCases")}
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
            <label className="block mb-2">Hidden Test Cases</label>
            {formData.hiddenTestCases.map((tc, idx) => (
              <motion.div
                key={idx}
                className="relative border border-gray-700 rounded-md p-4 mb-4 bg-gray-800"
                variants={fieldVariants}
              >
                <motion.button
                  type="button"
                  onClick={() => removeTestCase("hiddenTestCases", idx)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-400 cursor-pointer"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX size={18} />
                </motion.button>
                {["input", "output"].map((f) => (
                  <textarea
                    key={f}
                    placeholder={f}
                    value={tc[f]}
                    onChange={(e) =>
                      handleTestCaseChange("hiddenTestCases", idx, f, e.target.value)
                    }
                    rows={3}
                    className="w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded-md resize-y mb-2"
                  />
                ))}
              </motion.div>
            ))}
            <motion.button
              type="button"
              onClick={() => addTestCase("hiddenTestCases")}
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
            {isLoading ? "Updating..." : "Update Problem"}
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default UpdateProblem;
