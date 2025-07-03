import React, { useState } from "react";
import { FaLaptopCode } from "react-icons/fa";
import { motion } from "framer-motion";
import useOnboarding from "../../hooks/useOnboarding";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const Branding = () => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.3 }}
    className="flex items-center gap-2 mb-4"
  >
    <FaLaptopCode className="text-3xl text-blue-500 drop-shadow" />
    <span className="text-4xl font-extrabold font-mono bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-purple-500 to-pink-400 drop-shadow">
      CodeX
    </span>
  </motion.div>
);

const FormField = ({ label, type = "text", name, value, onChange, placeholder, rows }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.55 }}
  >
    <label className="block mb-1 text-sm font-medium text-gray-300">{label}</label>
    {type === "textarea" ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows || 3}
        placeholder={placeholder}
        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
      />
    )}
  </motion.div>
);

const SubmitButton = ({ isLoading }) => (
  <motion.button
    type="submit"
    whileTap={{ scale: 0.95 }}
    whileHover={{ scale: 1.02 }}
    disabled={isLoading}
    className={`w-full py-2 text-lg font-semibold rounded-lg transition cursor-pointer ${
      isLoading
        ? "bg-blue-400"
        : "bg-blue-600 hover:bg-blue-700"
    } shadow-lg`}
  >
    {isLoading ? "Submitting..." : "🚀 Complete Onboarding"}
  </motion.button>
);

const OnboardingForm = ({
  formData,
  handleChange,
  handleSubmit,
  error,
  isLoading,
}) => (
  <form onSubmit={handleSubmit} className="space-y-5">
    <FormField
      label="Full Name"
      name="fullName"
      value={formData.fullName}
      onChange={handleChange}
      placeholder="John Doe"
    />
    <FormField
      label="Bio"
      name="bio"
      type="textarea"
      value={formData.bio}
      onChange={handleChange}
      placeholder="I'm a passionate problem solver..."
    />
    {error && (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-red-400 text-sm"
      >
        {error}
      </motion.p>
    )}
    <SubmitButton isLoading={isLoading} />
  </form>
);

const Onboarding = () => {
  const [formData, setFormData] = useState({ fullName: "", bio: "" });
  const [error, setError] = useState("");
  const { submitOnboarding, isLoading } = useOnboarding();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName || !formData.bio) {
      return setError("Full name and bio are required.");
    }

    await submitOnboarding(formData);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-900 text-white flex justify-center items-center px-4 py-10"
    >
      <motion.div
        variants={cardVariants}
        className="w-full max-w-6xl flex flex-col lg:flex-row shadow-2xl rounded-3xl overflow-hidden border border-gray-700 bg-gray-800"
      >
        {/* Left: Form */}
        <div className="w-full lg:w-1/2 p-8 space-y-6">
          <Branding />

          <motion.h2
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-white tracking-tight"
          >
            👋 Welcome!
          </motion.h2>
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-gray-400 text-sm"
          >
            Let’s complete your profile so we can help you shine ✨
          </motion.p>

          <OnboardingForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            error={error}
            isLoading={isLoading}
          />
        </div>

        {/* Right: Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="hidden lg:flex w-full lg:w-1/2 bg-gray-900 items-center justify-center p-10 border-l border-gray-700"
        >
          <div className="text-center space-y-6 max-w-md">
            <div className="relative aspect-square max-w-xs mx-auto rounded-lg overflow-hidden shadow-lg">
              <img
                src="/j.png"
                alt="Onboarding illustration"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-white">
              Showcase your skills
            </h3>
            <p className="text-gray-400 text-sm">
              Build a compelling profile that highlights your problem-solving journey on CodeX.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Onboarding;
