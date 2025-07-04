import { useState } from "react";
import { useSendContactMessageMutation } from "../../redux/api/contactAPI";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-6 py-16 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-10">
        <ContactHeader />
        <ContactForm
          formData={formData}
          isLoading={isLoading}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
        <ContactFooter />
      </div>
    </div>
  );
};

const ContactHeader = () => (
  <div className="text-center space-y-4">
    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-md">
      Contact Us
    </h1>
    <p className="text-gray-400 text-lg">
      Have a question, suggestion, or just want to say hello? We'd love to hear from you!
    </p>
  </div>
);

const ContactForm = ({ formData, isLoading, handleChange, handleSubmit }) => (
  <form
    onSubmit={handleSubmit}
    className="space-y-6 bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700"
  >
    <InputField
      label="Name"
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      placeholder="Your Name"
    />
    <InputField
      label="Email"
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
      placeholder="Write your message..."
    />
    <div className="text-center pt-4">
      <button
        type="submit"
        disabled={isLoading}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white px-8 py-3 rounded-full font-semibold shadow-md transition duration-300 hover:cursor-pointer"
      >
        {isLoading ? "Sending..." : "🚀 Send Message"}
      </button>
    </div>
  </form>
);

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const TextAreaField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <textarea
      {...props}
      rows="5"
      className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
    ></textarea>
  </div>
);

const ContactFooter = () => (
  <div className="text-center text-gray-400 text-sm">
    Or email us directly at{" "}
    <a
      href="mailto:support@codex.com"
      className="text-blue-400 hover:underline"
    >
      support@codex.com
    </a>
  </div>
);

export default Contact;
