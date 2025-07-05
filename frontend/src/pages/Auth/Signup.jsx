import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import useSignup from "../../hooks/useSignup.js";

const Branding = () => (
  <motion.div
    initial={{ x: -30, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.3, duration: 0.5 }}
    className="flex items-center gap-2 mb-4"
  >
    <FaUserPlus className="text-3xl text-blue-500" />
    <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
      Join CodeX
    </span>
  </motion.div>
);

const Illustration = () => (
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.5, duration: 0.6 }}
    className="hidden lg:flex w-full lg:w-1/2 bg-gray-900 items-center justify-center p-10 border-l border-gray-700"
  >
    <div className="text-center space-y-6 max-w-md">
      <div className="relative aspect-square max-w-xs mx-auto rounded-lg overflow-hidden shadow-lg">
        <img
          src="/i.png"
          alt="Signup illustration"
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-xl font-semibold text-white">
        Master DSA with real-world problems
      </h3>
      <p className="text-gray-400 text-sm">
        Join a growing community of passionate coders preparing for top companies and improving daily.
      </p>
    </div>
  </motion.div>
);

const SignupForm = ({ signupData, setSignupData, handleSignup, isLoading }) => (
  <div className="w-full lg:w-1/2 p-6 sm:p-10 space-y-6">
    <Branding />

    <motion.h2
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="text-2xl font-bold"
    >
      Create Your Account
    </motion.h2>

    <p className="text-gray-400 text-sm mb-6">
      Start solving DSA problems and build your coding portfolio.
    </p>

    <form onSubmit={handleSignup} className="space-y-4">
      <InputField
        label="Username"
        type="text"
        placeholder="your_coder_name"
        value={signupData.username}
        onChange={(e) =>
          setSignupData({ ...signupData, username: e.target.value })
        }
      />
      <InputField
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={signupData.email}
        onChange={(e) =>
          setSignupData({ ...signupData, email: e.target.value })
        }
      />
      <InputField
        label="Password"
        type="password"
        placeholder="••••••••"
        value={signupData.password}
        onChange={(e) =>
          setSignupData({ ...signupData, password: e.target.value })
        }
      />

      <motion.button
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="btn btn-primary w-full bg-blue-600 hover:bg-blue-700 border-none"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </motion.button>

      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-400 hover:underline">
          Sign in
        </Link>
      </p>

      <p className="text-sm text-center">
        Want to try without an account?{" "}
        <Link to="/problems" className="text-purple-400 hover:underline">
          Take a demo
        </Link>
      </p>
    </form>
  </div>
);

const InputField = ({ label, type, placeholder, value, onChange }) => (
  <div className="form-control">
    <label className="label">
      <span className="text-sm">{label}</span>
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="input input-bordered bg-gray-700 text-white w-full"
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

const Signup = () => {
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { signup, isLoading } = useSignup();

  const handleSignup = (e) => {
    e.preventDefault();
    signup(signupData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl flex flex-col lg:flex-row shadow-2xl rounded-xl overflow-hidden border border-gray-700 bg-gray-800"
      >
        <SignupForm
          signupData={signupData}
          setSignupData={setSignupData}
          handleSignup={handleSignup}
          isLoading={isLoading}
        />
        <Illustration />
      </motion.div>
    </motion.div>
  );
};

export default Signup;
