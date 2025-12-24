export default function StatsSummary({ stats, darkMode }) {
  const tileClass = `
    rounded-2xl p-6 transition-all duration-300
    hover:-translate-y-1
    ${
      darkMode
        ? "bg-zinc-900 border border-zinc-800"
        : "bg-white border border-gray-200 shadow-sm hover:shadow-md"
    }
  `;

  const labelClass = darkMode
    ? "text-zinc-500"
    : "text-gray-500";

  const valueClass = darkMode
    ? "text-white"
    : "text-black";

  return (
    <div className="mt-10">
      {/* HEADER */}
      <div className="mb-6">
        <h2
          className={`text-2xl font-light ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Stats Summary
        </h2>
        <p
          className={`text-sm ${
            darkMode ? "text-zinc-500" : "text-gray-500"
          }`}
        >
          Key performance indicators at a glance
        </p>
      </div>

      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {Object.entries(stats)
          .filter(([key]) => key !== "students")
          .map(([key, value]) => (
            <div key={key} className={tileClass}>
              <p className={`text-sm uppercase tracking-wide mb-1 ${labelClass}`}>
                {key.replace(/_/g, " ")}
              </p>

              <p className={`text-3xl font-light ${valueClass}`}>
                {Array.isArray(value)
                  ? value.join(", ")
                  : typeof value === "number"
                  ? value
                  : value || "—"}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
