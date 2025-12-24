import { useThemeStore } from "../stores/ThemeStore";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import TopThreeLeaderboard from "../components/Leaderboard";
import ChartsSection from "../components/ChartSection";
import StatsSummary from "../components/StatsSummary";
import AiOverview from "../components/AIOverview";
import { useIsLoggedIn } from "../stores/IsLoggedInStore";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function SavedResultsPage() {
  const isLoggedIn = useIsLoggedIn((s) => s.isLoggedIn);
  const darkMode = useThemeStore((s) => s.darkMode);
  const navigate = useNavigate();
  const { id } = useParams();

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const loadSavedViz = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/saved-results/${id}`
        );
        const data = await res.json();
        setResult(data.visualization || null);
      } catch {
        setResult(null);
      } finally {
        setLoading(false);
      }
    };

    loadSavedViz();
  }, [id]);

  
  const handleDownload = async () => {
    const element = document.getElementById("saved-results-export");
    if (!element) return;

    element.classList.add("export-safe");
    await new Promise((r) => setTimeout(r, 50));

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

    pdf.save(`${result.vizName || "EduStats_Report"}.pdf`);
  };

  
  if (loading)
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

  if (!result)
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${
          darkMode ? "bg-zinc-950 text-white" : "bg-gray-50 text-black"
        }`}
      >
        <h1 className="text-2xl mb-6">No results found</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 rounded-xl bg-indigo-500/10 text-indigo-400"
        >
          Go Back
        </button>
      </div>
    );

  const { vizName, studentResults, stats } = result;

  return (
    <div
      className={`min-h-screen pt-24 px-6 ${
        darkMode ? "bg-zinc-950 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <button
            onClick={handleDownload}
            className="cursor-pointer hover:bg-green-500/60 transition-all duration-500 hover:text-white fixed right-8 top-6 px-4 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400"
          >
            Download Full Report
          </button>
      {/* NAV */}
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-40
        w-[92%] max-w-4xl rounded-2xl px-6 py-4 backdrop-blur-md ${
          darkMode
            ? "bg-zinc-900/70 border border-zinc-800"
            : "bg-white/70 border border-gray-200"
        }`}
      >
        
        <div className="flex justify-center gap-6 items-center text-sm">
          <a href="#charts-section" className="hover:text-indigo-400">Charts</a>
          <a href="#stats-summary" className="hover:text-indigo-400">Stats</a>
          <a href="#ai-overview" className="hover:text-indigo-400">AI Insights</a>

          <button
            onClick={() => setShowLeaderboard(true)}
            className="px-4 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400"
          >
            Leaderboard
          </button>

          
        </div>
      </nav>

      <div className="text-center mb-14">
        <p className="text-3xl font-light">{vizName}</p>
        <p className="text-zinc-500">
          Total Students · {studentResults.length}
        </p>
      </div>

      <div
        id="saved-results-export"
        className="max-w-7xl mx-auto flex flex-col gap-10"
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

      
      <div className="mt-14 text-center">
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-3 rounded-xl bg-zinc-800 text-zinc-300"
        >
          ← Go Back
        </button>
      </div>

      {showLeaderboard && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowLeaderboard(false)}
          />

          <div
            className={`relative w-[92%] max-w-4xl p-6 rounded-3xl ${
              darkMode ? "bg-zinc-900" : "bg-white"
            }`}
          >
            <button
              onClick={() => setShowLeaderboard(false)}
              className="absolute top-4 right-4"
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
