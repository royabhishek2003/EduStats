import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import MoreChartsSection from "./MoreCharts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement
);

export default function ChartSection({ studentResults, stats, darkMode }) {
  const [moreChartsVisible, setMoreChartsVisible] = useState(false);

  if (!studentResults || studentResults.length === 0) {
    return (
      <p className={darkMode ? "text-zinc-500" : "text-gray-500"}>
        No student data available
      </p>
    );
  }

  const labels = studentResults.map((s) => s.name);
  const marks = studentResults.map((s) => s.marks);
  const percentage = studentResults.map((s) =>
    Math.round((s.marks / s.totalMarks) * 100)
  );

  const barData = {
    labels,
    datasets: [
      {
        label: "Marks",
        data: marks,
        backgroundColor: "rgba(99,102,241,0.6)", // indigo
        borderRadius: 6,
      },
    ],
  };

  const lineData = {
    labels,
    datasets: [
      {
        label: "Percentage",
        data: percentage,
        borderColor: "rgb(99,102,241)",
        backgroundColor: "rgba(99,102,241,0.15)",
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: darkMode ? "#d4d4d8" : "#374151",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: darkMode ? "#a1a1aa" : "#4b5563",
        },
        grid: {
          color: darkMode ? "#27272a" : "#e5e7eb",
        },
      },
      y: {
        ticks: {
          color: darkMode ? "#a1a1aa" : "#4b5563",
        },
        grid: {
          color: darkMode ? "#27272a" : "#e5e7eb",
        },
      },
    },
  };

  const cardClass = `
    rounded-2xl p-6 transition-all duration-300
    ${
      darkMode
        ? "bg-zinc-900 border border-zinc-800"
        : "bg-white border border-gray-200 shadow-sm"
    }
  `;

  return (
    <div className="flex flex-col gap-6">
      
      <div className={`${cardClass} h-[320px]`}>
        <h3
          className={`text-lg font-medium mb-4 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Marks Distribution
        </h3>
        <Bar data={barData} options={chartOptions} />
      </div>

      
      <div className={`${cardClass} h-[320px]`}>
        <h3
          className={`text-lg font-medium mb-4 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Percentage Trend
        </h3>
        <Line data={lineData} options={chartOptions} />
      </div>

      
      <button
        onClick={() => setMoreChartsVisible((p) => !p)}
        className={`self-center px-6 py-2 rounded-xl font-medium transition ${
          darkMode
            ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
            : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
        }`}
      >
        {moreChartsVisible ? "Hide More Charts" : "Show More Charts"}
      </button>

      
      {moreChartsVisible && (
        <MoreChartsSection
          studentResults={studentResults}
          stats={stats}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}
