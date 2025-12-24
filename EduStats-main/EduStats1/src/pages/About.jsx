import { motion } from "framer-motion";
import { useThemeStore } from "../stores/ThemeStore";
import {
  BarChart3,
  UploadCloud,
  Eye,
  LineChart,
} from "lucide-react";

export default function About() {
  const darkMode = useThemeStore((s) => s.darkMode);

  return (
    <div
      className={`min-h-screen px-6 lg:px-24 py-20 transition-colors ${
        darkMode ? "bg-zinc-950" : "bg-gray-50"
      }`}
    >
      
      <section className="text-center max-w-4xl mx-auto mb-24">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`text-4xl md:text-6xl font-light tracking-tight mb-6 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Empowering Education Through Data
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={`text-lg ${
            darkMode ? "text-zinc-500" : "text-gray-600"
          }`}
        >
          EduStats transforms raw academic data into clean,
          meaningful and easy-to-understand insights.
        </motion.p>
      </section>

      
      <section className="max-w-4xl mx-auto mb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`rounded-2xl p-10 ${
            darkMode
              ? "bg-zinc-900"
              : "bg-white shadow-sm"
          }`}
        >
          <h2
            className={`text-2xl font-medium mb-4 ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            Our Mission
          </h2>
          <p
            className={`leading-relaxed ${
              darkMode ? "text-zinc-500" : "text-gray-600"
            }`}
          >
            We’re building a simplified platform where students
            and educators can visualize performance, track
            growth, upload data and convert it into insights —
            without the complexity of traditional analytics tools.
          </p>
        </motion.div>
      </section>

      
      <section className="max-w-7xl mx-auto mb-28">
        <h2
          className={`text-3xl font-light text-center mb-14 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          What Makes EduStats Different
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: BarChart3,
              title: "Data Visualization",
              desc: "Turn raw numbers into clean charts and dashboards instantly.",
            },
            {
              icon: UploadCloud,
              title: "Easy Uploads",
              desc: "Upload Excel or CSV files and get insights in seconds.",
            },
            {
              icon: Eye,
              title: "Instant Insights",
              desc: "Understand trends, performance and growth at a glance.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className={`group relative overflow-hidden rounded-2xl p-8 transition ${
                darkMode
                  ? "bg-zinc-900 hover:bg-zinc-900/80"
                  : "bg-white hover:bg-gray-50 shadow-sm hover:shadow-md"
              }`}
            >
              <div
                className={`absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl opacity-20 ${
                  darkMode ? "bg-indigo-500" : "bg-indigo-400"
                }`}
              ></div>

              <div className="relative text-center">
                <item.icon
                  className={`mx-auto mb-4 w-10 h-10 ${
                    darkMode
                      ? "text-indigo-400"
                      : "text-indigo-600"
                  }`}
                />
                <h3
                  className={`text-xl font-medium mb-2 ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-zinc-500" : "text-gray-600"
                  }`}
                >
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      
      <section className="max-w-5xl mx-auto mb-28">
        <h2
          className={`text-3xl font-light text-center mb-14 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Our Journey
        </h2>

        <div className="space-y-6">
          {[
            {
              title: "The Idea",
              desc: "A simple way for students to visualize progress without complex tools.",
            },
            {
              title: "Building the Platform",
              desc: "Modern UI, dashboards, dark mode and secure data handling.",
            },
            {
              title: "The Future",
              desc: "AI insights, predictions and intelligent trend analysis.",
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className={`rounded-xl p-6 ${
                darkMode
                  ? "bg-zinc-900"
                  : "bg-white shadow-sm"
              }`}
            >
              <h4
                className={`text-lg font-medium ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                {step.title}
              </h4>
              <p
                className={`mt-1 ${
                  darkMode ? "text-zinc-500" : "text-gray-600"
                }`}
              >
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      
      <section className="text-center max-w-3xl mx-auto">
        <h2
          className={`text-2xl font-medium mb-4 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Ready to Explore Your Data?
        </h2>
        <p
          className={`mb-8 ${
            darkMode ? "text-zinc-500" : "text-gray-600"
          }`}
        >
          Start your journey with clean dashboards and
          meaningful insights.
        </p>

        <a
          href="/home"
          className={`group inline-flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition ${
            darkMode
              ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
              : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          }`}
        >
          Get Started <span className="group-hover:-rotate-45 transition-all duration-500 text-indigo-400">→</span>
        </a>
      </section>
    </div>
  );
}
