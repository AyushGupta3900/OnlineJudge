import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Home = () => {
  const [faqs, setFaqs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        setFaqs(data.faqs || []);
        setTestimonials(data.testimonials || []);
      })
      .catch((err) => console.error("Failed to load data.json", err));
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen px-6 py-10">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mt-24 sm:mt-28 lg:mt-32 space-y-6"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient">
          Sharpen Your Coding Skills
        </h2>
        <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
          Ace your interviews and master DSA by solving expertly curated problems across all difficulty levels.
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
      </motion.section>

      {/* Features Section */}
      <section className="mt-24 sm:mt-28 lg:mt-32 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 justify-items-center">
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
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-24 sm:mt-28 lg:mt-32 text-center max-w-4xl mx-auto space-y-6 px-4"
      >
        <h2 className="text-3xl md:text-4xl font-bold">Explore Structured Courses</h2>
        <p className="text-base text-gray-400">
          Take your learning to the next level with beginner to advanced courses in Data Structures, Algorithms, and System Design.
        </p>
        <Link
          to="/courses"
          className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-base md:text-lg font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          📘 Browse Courses
        </Link>
      </motion.section>

      {/* Benefits Section */}
      <section className="mt-24 sm:mt-28 lg:mt-32 relative z-10 bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-md rounded-3xl shadow-2xl py-16 px-6 max-w-7xl mx-auto text-center space-y-12 border border-gray-700">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
          Why Developers Love CodeX 💙
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 md:px-8 justify-items-center">
          {["🧩", "⚡", "📈", "👥", "✅", "💬"].map((icon, index) => (
            <Benefit
              key={index}
              icon={icon}
              title={["Real Interview Questions", "Fast & Intuitive UI", "Performance Tracking", "Peer Ranking System", "Instant Code Feedback", "Supportive Community"][index]}
              color={["from-purple-500 to-indigo-500", "from-pink-500 to-orange-500", "from-blue-500 to-sky-500", "from-green-500 to-emerald-500", "from-yellow-500 to-orange-400", "from-teal-500 to-cyan-500"][index]}
            />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-24 sm:mt-28 lg:mt-32 text-center max-w-5xl mx-auto px-4"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-10">
          What Developers Are Saying ❤️
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <p className="text-gray-300 italic mb-4">“{testimonial.text}”</p>
              <p className="text-blue-400 font-semibold">- {testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-24 sm:mt-28 lg:mt-32 max-w-4xl mx-auto px-4"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.details
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className="group bg-gray-800 border border-gray-700 rounded-xl p-4 transition-all duration-300 hover:border-blue-500 overflow-hidden"
            >
              <summary className="cursor-pointer list-none flex justify-between items-center text-white text-lg font-medium group-open:text-blue-400">
                <span>{faq.question}</span>
                <span className="ml-2 text-blue-400 group-open:rotate-180 transition-transform duration-300">▼</span>
              </summary>
              <div className="mt-2 text-gray-400 text-sm leading-relaxed transition-all duration-300">
                {faq.answer}
              </div>
            </motion.details>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-10">
          <p className="text-gray-400 mb-2">Still have questions?</p>
          <Link
            to="/contact"
            className="inline-block px-6 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg transition-transform transform hover:scale-105"
          >
            📩 Contact Support
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;

// FeatureCard Component
const FeatureCard = ({ icon, title, description, bgColor }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-center"
  >
    <div className={`flex justify-center items-center w-14 h-14 mx-auto mb-4 rounded-full text-white text-2xl ${bgColor}`}>
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-400">{description}</p>
  </motion.div>
);

const Benefit = ({ icon, title, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="w-full sm:w-[90%] bg-gray-900/70 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-[1.03]"
  >
    <div className={`text-3xl mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${color} text-white shadow-md`}>
      {icon}
    </div>
    <h3 className="text-base font-medium text-white">{title}</h3>
  </motion.div>
);
