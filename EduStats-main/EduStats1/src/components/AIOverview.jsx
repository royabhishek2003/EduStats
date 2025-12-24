import { useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function AiOverview({ stats, studentResults, darkMode }) {
  const api_key = import.meta.env.VITE_OPEN ?? "";
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  function convertInsightsArray(lines) {
    if (!lines || lines.length === 0) return [];

    const main = lines.slice(1);

    return main.map((item) => {
      const [title, ...rest] = item.split(":");
      return {
        title: title.trim(),
        body: rest.join(":").trim(),
      };
    });
  }

  function extractInsights(text) {
    if (!text) return [];
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/^[\s\-•]+/gm, "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
  }

  async function generateInsights() {
    setExpanded(true);
    setLoading(true);

    if (!api_key) {
      setInsights((prev) => [
        ...prev,
        {
          title: "API Key Missing",
          body: "Add VITE_OPEN to your .env file and restart the dev server. For production, move this call to the backend.",
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${api_key}`,
          "HTTP-Referer": "http://localhost",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b:free",
          messages: [
            {
              role: "user",
              content: `
Return EXACTLY 6 lines of plain text.

Line 1 must be a short intro sentence (no colon).

Lines 2–6 must follow this STRICT format:
Title: Insight text

Rules:
- EXACTLY one colon per insight
- No bullets, no markdown, no emojis
- Mention student names naturally
- Keep each insight concise (1–2 sentences)

Stats: ${JSON.stringify(stats)}
Students: ${JSON.stringify(studentResults)}
`,
            },
          ],
        }),
      });

      const data = await res.json();
      const output = data?.choices?.[0]?.message?.content || "";
      const extracted = extractInsights(output);
      const parsed = convertInsightsArray(extracted);

      setInsights((prev) => [...prev, ...parsed]);
    } catch {
      setInsights((prev) => [
        ...prev,
        { title: "Error", body: "Failed to generate insights." },
      ]);
    }

    setLoading(false);
  }

  return (
    <motion.div
      layout
      transition={{ layout: { duration: 0.35 } }}
      className={`p-6 mt-6 rounded-2xl border ${
        darkMode
          ? "bg-zinc-900 border-zinc-800 text-white"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <SparklesIcon className="h-6 w-6 text-indigo-400" />
        <h2 className="text-2xl font-medium">AI Insights</h2>
      </div>

      <p className={`mb-4 ${darkMode ? "text-zinc-500" : "text-gray-600"}`}>
        Generate smart, actionable insights based on student performance.
      </p>

      <button
        onClick={generateInsights}
        disabled={loading}
        className={`px-4 py-2 rounded-xl font-medium transition ${
          darkMode
            ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
            : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
        }`}
      >
        {insights.length > 0 ? "Generate more Insights" : "Generate Insights"}
      </button>

      {/* INLINE LOADER */}
      {loading && (
        <div className="flex justify-center mt-6">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
        </div>
      )}

      <AnimatePresence>
        {expanded && insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 space-y-4"
          >
            {insights.map((insight, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl ${
                  darkMode ? "bg-zinc-800/60" : "bg-gray-50"
                }`}
              >
                <h4 className="text-lg font-medium text-indigo-400">
                  {insight.title}
                </h4>
                <p
                  className={`mt-1 ${
                    darkMode ? "text-zinc-300" : "text-gray-700"
                  }`}
                >
                  {insight.body}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
