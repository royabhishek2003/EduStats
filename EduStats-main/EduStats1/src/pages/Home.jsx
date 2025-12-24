import { BarChart3, UploadCloud, Eye, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useIsLoggedIn } from "../stores/IsLoggedInStore";
import { useThemeStore } from "../stores/ThemeStore";
import { useNavigate } from "react-router-dom";
import ExcelUpload from "../components/UploadFile";
import WelcomeBack from "../components/WelcomeBack";
import Carousel from "../components/Carousel";

export default function Home() {
  const navigate = useNavigate();
  const darkMode = useThemeStore((s) => s.darkMode);
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(null);
  const user = useIsLoggedIn((s) => s.user);
  const login = useIsLoggedIn((s) => s.login);

  useEffect(() => {
    console.log(import.meta.env.KEY);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

 
  useEffect(() => {
    if (user) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/api/profile", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && data.user) login(data.user);
      } catch (err) {

      }
    })();
    return () => {
      mounted = false;
    };
  }, [user, login]);

  useEffect(() => {
    async function loadStats() {
      if (!user?.email) return;
      try {
        const res = await fetch(`http://localhost:3000/api/visuals/${user.email}`, {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();


        const visuals = data.visualizations || [];
        const totalVisuals = data.total ?? visuals.length;

        const totalStudents = visuals.reduce((acc, v) => {
          return acc + (Array.isArray(v.studentResults) ? v.studentResults.length : 0);
        }, 0);


        const means = visuals
          .map((v) => {
            const m = v.stats?.mean;
            if (typeof m === "number") return m;
            if (typeof m === "string") return parseFloat(m);
            return NaN;
          })
          .filter((n) => !Number.isNaN(n));
        const avgScore = means.length
          ? Math.round((means.reduce((a, b) => a + b, 0) / means.length) * 10) / 10
          : null;

        // estimate hours logged: assume ~15 minutes per student record
        const hoursLogged = Math.round((totalStudents * 15) / 60);

        setStatsData({ totalVisuals, totalStudents, avgScore, hoursLogged });
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    }

    loadStats();
  }, [user]);

  if (loading) {
    return (
      <div
        className={`flex flex-col items-center justify-center min-h-screen ${
          darkMode ? "bg-zinc-950" : "bg-white"
        }`}
      >
        <div className="relative">
          <Loader2
            className={`w-10 h-10 animate-spin ${
              darkMode ? "text-white" : "text-black"
            }`}
          />
          <div
            className={`absolute inset-0 w-10 h-10 rounded-full blur-xl ${
              darkMode ? "bg-white/20" : "bg-black/10"
            }`}
          ></div>
        </div>
      </div>
    );
  }
  function randomChange() {
    const change = Math.floor(Math.random() * 21) - 10;
    return (change >= 0 ? "+" : "") + change + "%";
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-zinc-950" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        <WelcomeBack name={user?.name || "User"} darkMode={darkMode} />

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <button
              id="track-new"
              onClick={() => navigate("/home/manual")}
              className={`group relative overflow-hidden rounded-2xl p-8 text-left transition-all duration-300 hover:-translate-y-1 ${
                darkMode
                  ? "bg-zinc-900 hover:bg-zinc-900/80"
                  : "bg-white border-1 border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md"
              }`}
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity ${
                  darkMode ? "bg-blue-500" : "bg-blue-400"
                }`}
              ></div>

              <div className="relative ">
                <div
                  className={`inline-flex p-3  rounded-xl mb-4 ${
                    darkMode ? "bg-blue-500/10" : "bg-blue-50"
                  }`}
                >
                  <BarChart3
                    className={`w-6 h-6 ${
                      darkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                </div>
                <h3
                  className={`text-xl font-medium mb-2 ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                >
                  Track New
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    darkMode ? "text-zinc-500" : "text-gray-600"
                  }`}
                >
                  Keep tabs on your learning progress effortlessly
                </p>
              </div>
            </button>

            
            <ExcelUpload />

            
            <button
              onClick={() => navigate("/dashboard")}
              className={`group relative overflow-hidden rounded-2xl p-8 text-left sm:col-span-2 transition-all duration-300 hover:-translate-y-1 ${
                darkMode
                  ? "bg-zinc-900 hover:bg-zinc-900/80"
                  : "bg-white border-1 border-gray-400  hover:bg-gray-50 shadow-sm hover:shadow-md"
              }`}
            >
              <div
                className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity ${
                  darkMode ? "bg-amber-500" : "bg-amber-400"
                }`}
              ></div>

              <div className="relative">
                <div
                  className={`inline-flex p-3 rounded-xl mb-4 ${
                    darkMode ? "bg-amber-500/10" : "bg-amber-50"
                  }`}
                >
                  <Eye
                    className={`w-6 h-6 ${
                      darkMode ? "text-amber-400" : "text-amber-600"
                    }`}
                  />
                </div>
                <h3
                  className={`text-xl font-medium mb-2 ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                >
                  View Insights
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    darkMode ? "text-zinc-500" : "text-gray-600"
                  }`}
                >
                  Visualize metrics and track trends with beautiful charts
                </p>
              </div>
            </button>
          </div>

          
          <div className="min-h-[400px]">
            <Carousel darkMode={darkMode} />
          </div>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            {
              label: "Total Sessions",
              value: statsData ? String(statsData.totalVisuals) : "—",
              change: randomChange(),
            },
            {
              label: "Hours Logged",
              value: statsData ? String(statsData.hoursLogged) : "—",
              change: randomChange(),
            },
            {
              label: "Avg. Score",
              value: statsData
                ? statsData.avgScore !== null
                  ? `${statsData.avgScore}%`
                  : "—"
                : "—",
              change: randomChange(),
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`rounded-xl p-6 ${
                darkMode ? "bg-zinc-900/50" : "bg-white/50 shadow-sm"
              }`}
            >
              <p
                className={`text-sm mb-1 ${
                  darkMode ? "text-zinc-500" : "text-gray-500"
                }`}
              >
                {stat.label}
              </p>
              <div className="flex items-end justify-between">
                <h4
                  className={`text-3xl font-light ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                >
                  {stat.value}
                </h4>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    darkMode
                      ? "bg-green-500/10 text-green-400"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
