import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PageLoader = () => (
  <div className="flex flex-col gap-4 justify-center items-center min-h-screen bg-black text-white">
    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-cyan-400 text-lg">Loading Home Page…</p>
  </div>
);

const Home = () => {
  const [faqs, setFaqs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [features, setFeatures] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/home.json")
      .then((res) => res.json())
      .then((data) => {
        setFaqs(data.faqs || []);
        setTestimonials(data.testimonials || []);
        setFeatures(data.features || []);
        setBenefits(data.benefits || []);
      })
      .catch((err) => console.error("Failed to load home.json", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white min-h-screen px-6 py-10">
      <HeroSection />

      {/* Features */}
      <section className="mt-28 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </section>

      <CoursesSection />

      {/* Benefits */}
      <section className="mt-28 bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl py-16 px-6 max-w-7xl mx-auto text-center border border-gray-700 space-y-12">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
          Why Developers Choose Us 💙
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 md:px-8">
          {benefits.map((b) => (
            <Benefit key={b.title} {...b} />
          ))}
        </div>
      </section>

      <TestimonialsSection testimonials={testimonials} />

      <FAQSection faqs={faqs} />
    </div>
  );
};

export default Home;

// 💡 Your sections below remain the same ⬇️

const HeroSection = () => (
  <motion.section
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="relative text-center mt-20 sm:mt-24 lg:mt-28 space-y-6"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse blur-3xl pointer-events-none"></div>

    <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
      Sharpen Your Coding Skills
    </h2>

    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
      Ace your interviews and master DSA by solving expertly curated problems across all difficulty levels.
    </p>

    <Link
      to="/problems"
      className="inline-block px-10 py-4 bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-white text-lg font-semibold rounded-full shadow-xl transition-transform hover:-translate-y-1 hover:scale-105"
    >
      🚀 Start Solving
    </Link>

    <p className="text-sm text-gray-500 italic">
      Trusted by thousands of developers to crack coding interviews.
    </p>
  </motion.section>
);

const CoursesSection = () => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="mt-28 text-center max-w-4xl mx-auto space-y-6 px-4"
  >
    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-500 text-transparent bg-clip-text">
      Dive Into Our Courses
    </h2>
    <p className="text-base text-gray-400">
      Beginner to advanced — courses in Data Structures, Algorithms, and System Design crafted by experts.
    </p>
    <Link
      to="/courses"
      className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white text-lg font-semibold rounded-full shadow-xl transition-transform hover:-translate-y-1 hover:scale-105"
    >
      📘 Browse Courses
    </Link>
  </motion.section>
);

const TestimonialsSection = ({ testimonials }) => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="mt-28 text-center max-w-5xl mx-auto px-4"
  >
    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text mb-10">
      What Developers Say ❤️
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {testimonials.map((t, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg"
        >
          <p className="text-gray-300 italic mb-4">“{t.text}”</p>
          <p className="text-cyan-400 font-semibold">- {t.name}</p>
        </motion.div>
      ))}
    </div>
  </motion.section>
);

const FAQSection = ({ faqs }) => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="mt-28 max-w-4xl mx-auto px-4"
  >
    <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-10">
      Frequently Asked Questions
    </h2>

    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <motion.details
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className="group bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-cyan-500"
        >
          <summary className="cursor-pointer flex justify-between items-center text-lg font-medium text-white group-open:text-cyan-400">
            <span>{faq.question}</span>
            <span className="ml-2 text-cyan-400 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-2 text-gray-400 text-sm leading-relaxed">
            {faq.answer}
          </div>
        </motion.details>
      ))}
    </div>

    <div className="text-center mt-10">
      <p className="text-gray-400 mb-2">Still have questions?</p>
      <Link
        to="/contact"
        className="inline-block px-6 py-2 text-sm bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-full shadow-md transition-transform hover:-translate-y-1 hover:scale-105"
      >
        📩 Contact Support
      </Link>
    </div>
  </motion.section>
);

const FeatureCard = ({ icon, title, description, bgColor }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="bg-gray-800 p-6 rounded-2xl shadow-xl hover:scale-[1.03] text-center"
  >
    <div
      className={`flex justify-center items-center w-16 h-16 mx-auto mb-4 rounded-full text-white text-2xl shadow-md ${bgColor}`}
    >
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
    className="w-full sm:w-[90%] bg-gray-900/70 border border-gray-700 rounded-xl p-6 shadow-lg hover:scale-[1.04]"
  >
    <div
      className={`text-3xl mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${color} text-white shadow-md`}
    >
      {icon}
    </div>
    <h3 className="text-base font-medium text-white">{title}</h3>
  </motion.div>
);
