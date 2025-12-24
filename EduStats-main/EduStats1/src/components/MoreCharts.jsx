import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MoreChartsSection({ studentResults, stats, darkMode }) {
  if (!studentResults || studentResults.length === 0) return null;

  /* ================= PASS / FAIL ================= */
  const passFailData = {
    labels: ["Pass", "Fail"],
    datasets: [
      {
        data: [stats.passCount, stats.failCount],
        backgroundColor: darkMode
          ? ["#22c55e", "#ef4444"]
          : ["#16a34a", "#dc2626"],
        borderWidth: 0,
        hoverOffset: 16,
      },
    ],
  };

  /* ================= GRADE DISTRIBUTION ================= */
  const gradeBuckets = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  studentResults.forEach((s) => {
    const pct = (s.marks / s.totalMarks) * 100;
    if (pct >= 90) gradeBuckets.A++;
    else if (pct >= 80) gradeBuckets.B++;
    else if (pct >= 70) gradeBuckets.C++;
    else if (pct >= 60) gradeBuckets.D++;
    else gradeBuckets.F++;
  });

  const gradeData = {
    labels: Object.keys(gradeBuckets),
    datasets: [
      {
        data: Object.values(gradeBuckets),
        backgroundColor: darkMode
          ? ["#818cf8", "#60a5fa", "#facc15", "#fb923c", "#f87171"]
          : ["#6366f1", "#3b82f6", "#eab308", "#f97316", "#ef4444"],
        borderWidth: 0,
        hoverOffset: 16,
      },
    ],
  };

  /* ================= PERFORMANCE ================= */
  const performance = { High: 0, Average: 0, Low: 0 };
  studentResults.forEach((s) => {
    const pct = (s.marks / s.totalMarks) * 100;
    if (pct >= 80) performance.High++;
    else if (pct >= 50) performance.Average++;
    else performance.Low++;
  });

  const performanceData = {
    labels: ["High (80%+)", "Average (50–79%)", "Low (< 50%)"],
    datasets: [
      {
        data: Object.values(performance),
        backgroundColor: darkMode
          ? ["#38bdf8", "#facc15", "#ef4444"]
          : ["#0ea5e9", "#eab308", "#dc2626"],
        borderWidth: 0,
        hoverOffset: 16,
      },
    ],
  };

  /* ================= ABOVE / BELOW AVERAGE ================= */
  let above = 0;
  let below = 0;
  let equal = 0;

  studentResults.forEach((s) => {
    if (s.marks > stats.mean) above++;
    else if (s.marks < stats.mean) below++;
    else equal++;
  });

  const averageSplitData = {
    labels: ["Above Average", "Below Average", "At Average"],
    datasets: [
      {
        data: [above, below, equal],
        backgroundColor: darkMode
          ? ["#4ade80", "#f87171", "#a1a1aa"]
          : ["#22c55e", "#ef4444", "#9ca3af"],
        borderWidth: 0,
        hoverOffset: 16,
      },
    ],
  };

  /* ================= STYLES ================= */
  const cardClass = `
    rounded-2xl p-6 flex flex-col items-center justify-center
    transition-all duration-300
    ${
      darkMode
        ? "bg-zinc-900 border border-zinc-800"
        : "bg-white border border-gray-200 shadow-sm"
    }
  `;

  const titleClass = `
    text-lg font-medium mb-4
    ${darkMode ? "text-white" : "text-black"}
  `;

  const legendOptions = {
    plugins: {
      legend: {
        labels: {
          color: darkMode ? "#d4d4d8" : "#374151",
        },
      },
    },
  };

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* ABOVE / BELOW AVERAGE */}
      <div className={cardClass}>
        <h3 className={titleClass}>Above vs Below Average</h3>
        <div className="w-[260px]">
          <Pie data={averageSplitData} options={legendOptions} />
        </div>
      </div>

      {/* PASS / FAIL */}
      <div className={cardClass}>
        <h3 className={titleClass}>Pass vs Fail</h3>
        <div className="w-[260px]">
          <Pie data={passFailData} options={legendOptions} />
        </div>
      </div>

      {/* GRADE DISTRIBUTION */}
      <div className={cardClass}>
        <h3 className={titleClass}>Grade Distribution</h3>
        <div className="w-[260px]">
          <Pie data={gradeData} options={legendOptions} />
        </div>
      </div>

      {/* PERFORMANCE */}
      <div className={cardClass}>
        <h3 className={titleClass}>Performance Categories</h3>
        <div className="w-[260px]">
          <Pie data={performanceData} options={legendOptions} />
        </div>
      </div>
    </div>
  );
}
