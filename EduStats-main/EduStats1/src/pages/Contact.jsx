import { useThemeStore } from "../stores/ThemeStore";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Contact() {
  const darkMode = useThemeStore((s) => s.darkMode);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Message sent successfully");
        setForm({ name: "", email: "", message: "" });
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (err) {
      toast.error("Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div
      className={`min-h-screen px-6 lg:px-24 py-20 transition-colors ${
        darkMode ? "bg-zinc-950" : "bg-gray-50"
      }`}
    >
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto rounded-3xl p-10 md:p-20 ${
          darkMode
            ? "bg-zinc-900/50 border border-zinc-800"
            : "bg-white border border-gray-200 shadow-sm"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-10"
        >
          <div>
            <h2
              className={`text-4xl md:text-6xl font-light tracking-tight mb-4 ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Get in <br /> Touch
            </h2>
            <p
              className={`text-lg ${
                darkMode ? "text-zinc-500" : "text-gray-600"
              }`}
            >
              Have a question, need help, or want to share feedback?
              We’re here to help you.
            </p>
          </div>

          <div className="flex flex-col gap-6 text-sm">
            <div className="flex items-center gap-4">
              <Mail className="text-indigo-400" />
              <span className={darkMode ? "text-zinc-400" : "text-gray-600"}>
                royabhishek8483@gmail.com
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Phone className="text-indigo-400" />
              <span className={darkMode ? "text-zinc-400" : "text-gray-600"}>
                +91 7978012537
              </span>
            </div>

            <div className="flex items-center gap-4">
              <MapPin className="text-indigo-400" />
              <span className={darkMode ? "text-zinc-400" : "text-gray-600"}>
                Jalandhar, India
              </span>
            </div>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={sendMessage}
          className={`rounded-2xl p-10 flex flex-col gap-6 ${
            darkMode
              ? "bg-zinc-900 border border-zinc-800"
              : "bg-white border border-gray-200"
          }`}
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            placeholder="Your name"
            required
            className={`p-4 rounded-xl border outline-none transition ${
              darkMode
                ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-indigo-500"
                : "bg-gray-50 border-gray-300 placeholder:text-gray-400 focus:border-indigo-500"
            }`}
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Your email"
            required
            className={`p-4 rounded-xl border outline-none transition ${
              darkMode
                ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-indigo-500"
                : "bg-gray-50 border-gray-300 placeholder:text-gray-400 focus:border-indigo-500"
            }`}
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows="5"
            placeholder="Your message..."
            required
            className={`p-4 rounded-xl border outline-none transition resize-none ${
              darkMode
                ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-indigo-500"
                : "bg-gray-50 border-gray-300 placeholder:text-gray-400 focus:border-indigo-500"
            }`}
          />

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition ${
              darkMode
                ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            } ${loading && "opacity-60 cursor-not-allowed"}`}
          >
            {loading ? "Sending..." : "Send Message"} <Send size={18} />
          </button>
        </motion.form>
      </div>

      <p
        className={`text-center mt-10 text-sm ${
          darkMode ? "text-zinc-500" : "text-gray-500"
        }`}
      >
        We usually reply within 24 hours.
      </p>
    </div>
  );
}
