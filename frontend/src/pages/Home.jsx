import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen px-6 py-10">
      {/* Hero Section */}
      <section className="text-center mt-24 space-y-6">
        <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient">
          Sharpen Your Coding Skills
        </h2>
        <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
          Ace your interviews and master DSA by solving expertly curated
          problems across all difficulty levels.
        </p>
        <Link
          to="/problems"
          className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-base md:text-lg font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          🚀 Start Solving
        </Link>
        <p className="text-sm text-gray-500 italic">
          Trusted by thousands of developers to crack coding interviews.
        </p>
      </section>

      {/* Features */}
      <section className="mt-32 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 justify-items-center">
        <FeatureCard
          icon="🧠"
          title="DSA Problems"
          description="Solve handpicked coding problems covering all key topics: arrays, trees, graphs, DP, and more."
          bgColor="bg-blue-600"
        />
        <FeatureCard
          icon="🏆"
          title="Explore Our Courses"
          description="Structured learning paths in different domains designed to take you from beginner to pro."
          bgColor="bg-purple-600"
        />
        <FeatureCard
          icon="📜"
          title="Submission History"
          description="Track your solutions, revisit failed attempts, and analyze your growth over time."
          bgColor="bg-pink-600"
        />
      </section>

      {/* Courses Section */}
      <section className="mt-32 text-center max-w-4xl mx-auto space-y-6 px-4">
        <h2 className="text-3xl md:text-4xl font-bold">Explore Structured Courses</h2>
        <p className="text-base text-gray-400">
          Take your learning to the next level with beginner to advanced courses
          in Data Structures, Algorithms, and System Design.
        </p>
        <Link
          to="/courses"
          className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-base md:text-lg font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          📘 Browse Courses
        </Link>
      </section>

      {/* Benefits Section */}
      <section className="mt-32 relative z-10 bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-md rounded-3xl shadow-2xl py-16 px-6 max-w-7xl mx-auto text-center space-y-12 border border-gray-700">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
          Why Developers Love CodeX 💙
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 md:px-8 justify-items-center">
          {[
            {
              icon: "🧩",
              title: "Real Interview Questions",
              color: "from-purple-500 to-indigo-500",
            },
            {
              icon: "⚡",
              title: "Fast & Intuitive UI",
              color: "from-pink-500 to-orange-500",
            },
            {
              icon: "📈",
              title: "Performance Tracking",
              color: "from-blue-500 to-sky-500",
            },
            {
              icon: "👥",
              title: "Peer Ranking System",
              color: "from-green-500 to-emerald-500",
            },
            {
              icon: "✅",
              title: "Instant Code Feedback",
              color: "from-yellow-500 to-orange-400",
            },
            {
              icon: "💬",
              title: "Supportive Community",
              color: "from-teal-500 to-cyan-500",
            },
          ].map((item, index) => (
            <Benefit
              key={index}
              icon={item.icon}
              title={item.title}
              color={item.color}
            />
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="mt-32 text-center max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">Join Our Developer Community</h2>
        <p className="text-base text-gray-400">
          Get help, give help, and grow together with thousands of coders across
          the globe.
        </p>
      </section>

    </div>
  );
};

export default Home;

// Feature Card Component
const FeatureCard = ({ icon, title, description, bgColor }) => (
  <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-center">
    <div
      className={`flex justify-center items-center w-14 h-14 mx-auto mb-4 rounded-full text-white text-2xl ${bgColor}`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);

// Benefit Card Component
const Benefit = ({ icon, title, color }) => (
  <div className="w-full sm:w-[90%] bg-gray-900/70 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-[1.03]">
    <div
      className={`text-3xl mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${color} text-white shadow-md`}
    >
      {icon}
    </div>
    <h3 className="text-base font-medium text-white">{title}</h3>
  </div>
);
