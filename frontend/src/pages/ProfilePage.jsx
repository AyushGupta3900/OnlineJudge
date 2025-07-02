import React from "react";
import { useNavigate } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import {
  useDeleteUserAccountMutation,
  useUpdateUserAccountMutation,
} from "../redux/api/authAPI";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaCheckCircle, FaLock, FaStar, FaUser } from "react-icons/fa";
import { PiCodeBlockBold } from "react-icons/pi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

const MySwal = withReactContent(Swal);

const COLORS = {
  Easy: "#00C49F",
  Medium: "#FFBB28",
  Hard: "#FF4444",
};

const getDifficultyStats = (solvedProblems = []) => {
  const counts = { Easy: 0, Medium: 0, Hard: 0 };
  for (let problem of solvedProblems) {
    const difficulty = problem?.difficulty;
    if (counts[difficulty] !== undefined) counts[difficulty]++;
  }

  return Object.entries(counts).map(([name, value]) => ({
    name,
    value,
    fill: COLORS[name],
  }));
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { authUser: user, isLoading, isError, error } = useAuthUser();
  const pieData = getDifficultyStats(user?.solvedProblems);
  pieData[0].value = user?.solvedCountByDifficulty?.Easy || 0;
  pieData[1].value = user?.solvedCountByDifficulty?.Medium || 0;
  pieData[2].value = user?.solvedCountByDifficulty?.Hard || 0;

  const [deleteUserAccount] = useDeleteUserAccountMutation();
  const [updateUserAccount] = useUpdateUserAccountMutation();

  const handleDelete = async () => {
    const result = await MySwal.fire({
      title: "⚠️ Delete Account?",
      text: "This action is irreversible. Your data will be lost forever.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it",
      background: "#0f172a",
      color: "#f1f5f9",
    });

    if (result.isConfirmed) {
      try {
        await deleteUserAccount().unwrap();
        toast.success("Account deleted successfully.");
        navigate("/");
      } catch (err) {
        toast.error("Failed to delete account.");
        console.error(err);
      }
    }
  };

  const handleUpdate = async () => {
    const { value: formValues } = await MySwal.fire({
      title: "📝 Update Profile",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Full Name" style="background:#1e293b; color:white;" value="${user.fullName || ""}">
        <textarea id="swal-input2" class="swal2-textarea" placeholder="Bio" style="background:#1e293b; color:white;">${user.bio || ""}</textarea>
      `,
      background: "#0f172a",
      color: "#f8fafc",
      confirmButtonText: "Update",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#64748b",
      preConfirm: () => {
        const fullName = document.getElementById("swal-input1").value.trim();
        const bio = document.getElementById("swal-input2").value.trim();
        if (!fullName || !bio) {
          Swal.showValidationMessage("Both Full Name and Bio are required.");
        }
        return { fullName, bio };
      },
    });

    if (formValues) {
      try {
        await updateUserAccount(formValues).unwrap();
        toast.success("Account updated successfully.");
      } catch (err) {
        toast.error("Failed to update account.");
        console.error(err);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white px-3 py-8"
    >
      {/* Main Profile Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-gray-900 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-800"
      >
        {isLoading ? (
          <p className="text-blue-300 text-base animate-pulse text-center">
            Loading profile...
          </p>
        ) : isError ? (
          <p className="text-red-500 text-center">
            Failed to load profile: {error?.message || "Unknown error"}
          </p>
        ) : !user ? (
          <p className="text-gray-400 text-center">No user data available.</p>
        ) : (
          <>
            {/* User Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                {user.fullName || user.username}
              </h1>
              <p className="text-gray-300 text-base mt-1">{user.email}</p>
              {user.bio && (
                <p className="text-sm text-gray-400 mt-1 italic">{user.bio}</p>
              )}
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-300"
            >
              {[
                {
                  label: "Username",
                  value: user.username,
                  icon: <FaUser className="text-blue-400 text-xl" />,
                  shadow: "shadow-blue-500/20",
                },
                {
                  label: "Rating",
                  value: user.rating,
                  icon: <FaStar className="text-yellow-400 text-xl" />,
                  shadow: "shadow-yellow-400/20",
                },
                {
                  label: "Role",
                  value:
                    user.role.charAt(0).toUpperCase() + user.role.slice(1),
                  icon: <FaLock className="text-slate-400 text-xl" />,
                  shadow: "shadow-pink-400/20",
                },
                {
                  label: "Solved Problems",
                  value: user.solvedProblems?.length || 0,
                  icon: <FaCheckCircle className="text-green-400 text-xl" />,
                  shadow: "shadow-green-400/20",
                },
                {
                  label: "Total Submissions",
                  value: user.submissions?.length || 0,
                  icon: <PiCodeBlockBold className="text-purple-400 text-xl" />,
                  shadow: "shadow-purple-400/20",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * i }}
                  className={`bg-gray-800 rounded-xl p-4 flex justify-between items-center transition-all duration-300 hover:${item.shadow}`}
                >
                  <div>
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="text-lg font-semibold">{item.value}</p>
                  </div>
                  {item.icon && item.icon}
                </motion.div>
              ))}
            </motion.div>

            {/* Difficulty Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-5"
            >
              <h2 className="text-xl font-bold text-center mb-4 text-blue-300">
                🎯 Problem Difficulty Distribution
              </h2>
              <div className="w-full h-75">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={90}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Created At */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 text-xs text-center text-gray-500"
            >
              🎉 Account created on{" "}
              <span className="text-gray-300 font-medium">
                {new Date(user.createdAt).toDateString()}
              </span>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* ⚙️ Account Settings Section - Outside Main Card */}
      {!isLoading && user && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="max-w-4xl mx-auto mt-6 bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-blue-400 mb-4 text-center">
            ⚙️ Account Settings
          </h3>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 hover:scale-105 cursor-pointer"
            >
              Update Account
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 hover:scale-105 cursor-pointer"
            >
              Delete Account
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProfilePage;
