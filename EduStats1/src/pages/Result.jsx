import { useResultStore } from "../stores/ResultStore";
import { useThemeStore } from "../stores/ThemeStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2, X, ArrowBigDown } from "lucide-react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ChartsSection from "../components/ChartSection";
import StatsSummary from "../components/StatsSummary";
import AiOverview from "../components/AIOverview";
import TopThreeLeaderboard from "../components/Leaderboard";
import TeacherInsights from "../components/TeacherInsights";

export default function ResultsPage() {
  const results = useResultStore((s) => s.results);
  const darkMode = useThemeStore((s) => s.darkMode);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showTeacherInsights, setShowTeacherInsights] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-zinc-950" : "bg-gray-50"
        }`}
      >
        <Loader2
          className={`w-10 h-10 animate-spin ${
            darkMode ? "text-white" : "text-black"
          }`}
        />
      </div>
    );
  }

  if (!results) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center text-center px-6 ${
          darkMode ? "bg-zinc-950 text-white" : "bg-gray-50 text-black"
        }`}
      >
        <h1 className="text-2xl font-light mb-6">No saved results found</h1>
        <button
          onClick={() => navigate("/home")}
          className={`px-6 py-3 rounded-xl transition ${
            darkMode
              ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
              : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          }`}
        >
          Go Back
        </button>
      </div>
    );
  }

  const { vizName, studentResults, stats } = results;

  const handleDownload = async () => {
    const element = document.getElementById("results-export");
    if (!element) return;

    element.classList.add("export-safe");

    await new Promise((r) => setTimeout(r, 50)); // allow repaint

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    element.classList.remove("export-safe");

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("EduStats_Report.pdf");
  };

  return (
    <div
      className={`min-h-screen w-full pt-24 transition-colors ${
        darkMode ? "bg-zinc-950 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <button
        onClick={handleDownload}
        className={`fixed flex gap-2 items-center cursor-pointer right-8 top-6 px-4 py-1.5 rounded-lg transition ${
          darkMode
            ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        }`}
      >
        Download Full Report <ArrowBigDown size={18} />
      </button>

      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-40
        w-[92%] max-w-4xl rounded-2xl px-6 py-4
        backdrop-blur-md transition ${
          darkMode
            ? "bg-zinc-900/70 border border-zinc-800"
            : "bg-white/70 border border-gray-200 shadow-sm"
        }`}
      >
        <div
          className={`flex justify-center gap-6 text-sm font-medium items-center ${
            darkMode ? "text-zinc-300" : "text-gray-600"
          }`}
        >
          <button
            onClick={() => setShowTeacherInsights(true)}
            className={`absolute left-4 top-2.5 px-4 py-1.5 rounded-lg transition ${
              darkMode
                ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            }`}
          >
            TEACHER INSIGHTS
          </button>
          <a
            href="#charts-section"
            className="hover:text-indigo-400 transition"
          >
            Charts
          </a>
          <a href="#stats-summary" className="hover:text-indigo-400 transition">
            Stats
          </a>
          <a href="#ai-overview" className="hover:text-indigo-400 transition">
            AI Insights
          </a>

          <button
            onClick={() => setShowLeaderboard(true)}
            className={`absolute right-4 top-2.5 px-4 py-1.5 rounded-lg transition ${
              darkMode
                ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            }`}
          >
            Leaderboard
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto text-center mb-14">
        <p className="text-3xl font-light mb-1">{vizName}</p>
        <p className="text-lg text-zinc-500">
          Total Students · {studentResults.length}
        </p>
      </div>

      <div
        id="results-export"
        className="max-w-[85%] mx-auto flex flex-col gap-10"
      >
        <section id="charts-section">
          <ChartsSection
            studentResults={studentResults}
            stats={stats}
            darkMode={darkMode}
          />
        </section>

        <section id="stats-summary">
          <StatsSummary stats={stats} darkMode={darkMode} />
        </section>

        <section id="ai-overview">
          <AiOverview
            stats={stats}
            studentResults={studentResults}
            darkMode={darkMode}
          />
        </section>
      </div>

      <div className="mt-14 mb-10 text-center">
        <button
          onClick={() => navigate(-1)}
          className={`px-8 py-3 rounded-xl transition ${
            darkMode
              ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          ← Go Back
        </button>
      </div>
      {showTeacherInsights && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -80 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowTeacherInsights(false)}
          />

          <div
            className={`relative w-[92%] max-w-4xl rounded-3xl p-6 ${
              darkMode
                ? "bg-zinc-900 border border-zinc-800"
                : "bg-white border border-gray-200 shadow-xl"
            }`}
          >
            <button
              onClick={() => setShowTeacherInsights(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-800 transition"
            >
              <X />
            </button>

            <TeacherInsights
              stats={stats}
              studentResults={studentResults}
              darkMode={darkMode}
            />
          </div>
        </motion.div>
      )}

      {showLeaderboard && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -80 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLeaderboard(false)}
          />

          <div
            className={`relative w-[92%] max-w-4xl rounded-3xl p-6 ${
              darkMode
                ? "bg-zinc-900 border border-zinc-800"
                : "bg-white border border-gray-200 shadow-xl"
            }`}
          >
            <button
              onClick={() => setShowLeaderboard(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-800 transition"
            >
              <X />
            </button>

            <TopThreeLeaderboard
              studentResults={studentResults}
              darkMode={darkMode}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
