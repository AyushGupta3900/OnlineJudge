import { useState } from "react";
import { useSendContactMessageMutation } from "../../redux/api/contactAPI";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { motion } from "framer-motion";

const MySwal = withReactContent(Swal);

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sendContactMessage, { isLoading }] = useSendContactMessageMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      MySwal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all fields before submitting.",
        confirmButtonColor: "#6366f1",
        background: "#1f2937",
        color: "#f9fafb",
      });
      return;
    }

    try {
      const res = await sendContactMessage(formData).unwrap();

      await MySwal.fire({
        icon: "success",
        title: "Message Sent!",
        text: res.message || "Thank you for contacting us!",
        confirmButtonColor: "#10b981",
        background: "#1f2937",
        color: "#f9fafb",
      });

      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      MySwal.fire({
        icon: "error",
        title: "Failed to Send",
        text: err?.data?.error || "Something went wrong. Please try again later.",
        confirmButtonColor: "#ef4444",
        background: "#1f2937",
        color: "#f9fafb",
      });
    }
  };

  return (
    <div className="max-h-[150vh] overflow-y-auto bg-gradient-to-br from-gray-950 to-black text-white px-4 sm:px-6 py-10 sm:py-16 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full space-y-12"
      >
        <ContactHeader />
        <ContactForm
          formData={formData}
          isLoading={isLoading}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
        <ContactFooter />
      </motion.div>
    </div>
  );
};

const ContactHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="text-center space-y-4"
  >
    <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
      Get In Touch
    </h1>
    <p className="text-gray-400 text-lg max-w-xl mx-auto">
      Have a question, suggestion, or just want to say hello?{" "}
      <span className="text-white font-medium">We'd love to hear from you!</span>
    </p>
  </motion.div>
);

const ContactForm = ({ formData, isLoading, handleChange, handleSubmit }) => (
  <motion.form
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    onSubmit={handleSubmit}
    className="space-y-6 bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700"
  >
    <InputField
      label="Your Name"
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      placeholder="John Doe"
    />
    <InputField
      label="Email Address"
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="you@example.com"
    />
    <TextAreaField
      label="Message"
      name="message"
      value={formData.message}
      onChange={handleChange}
      placeholder="Write your message here..."
    />
    <div className="text-center pt-4">
      <button
        type="submit"
        disabled={isLoading}
        className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:from-pink-500 hover:to-blue-500 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
      >
        {isLoading ? "Sending..." : "🚀 Send Message"}
      </button>
    </div>
  </motion.form>
);

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
    />
  </div>
);

const TextAreaField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <textarea
      {...props}
      rows="5"
      className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
    ></textarea>
  </div>
);

const ContactFooter = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
    className="text-center text-gray-400 text-sm"
  >
    Or email us directly at{" "}
    <a
      href="mailto:support@codex.com"
      className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
    >
      support@codex.com
    </a>
  </motion.div>
);

export default Contact;
