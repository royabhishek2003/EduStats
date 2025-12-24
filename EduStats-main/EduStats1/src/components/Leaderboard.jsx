import React from "react";

export default function TopThreeLeaderboard({ studentResults = [], darkMode }) {
  const rankedStudents = [...studentResults]
    .map((s) => ({
      name: s.name || "—",
      score: s.totalMarks
        ? Math.round((Number(s.marks) / Number(s.totalMarks)) * 100)
        : Number(s.marks) || 0,
    }))
    .sort((a, b) => b.score - a.score);

  const topThree = [
    rankedStudents[0] || { name: "—", score: 0 },
    rankedStudents[1] || { name: "—", score: 0 },
    rankedStudents[2] || { name: "—", score: 0 },
  ];

  const displayOrder = [topThree[1], topThree[0], topThree[2]];

  const medalStyles = {
    gold: {
      bg: "bg-yellow-400",
      text: "text-yellow-900",
      avatar: "bg-yellow-50",
    },
    silver: {
      bg: "bg-gray-300",
      text: "text-gray-900",
      avatar: "bg-gray-50",
    },
    bronze: {
      bg: "bg-orange-400",
      text: "text-orange-900",
      avatar: "bg-orange-50",
    },
  };

  const positions = [
    { label: "2nd", medal: medalStyles.silver, size: "h-40 w-32", index: 0 },
    { label: "1st", medal: medalStyles.gold, size: "h-52 w-36", index: 1 },
    { label: "3rd", medal: medalStyles.bronze, size: "h-40 w-32", index: 2 },
  ];

  return (
    <div
      className={`
        w-full mx-auto mt-10 p-8 rounded-3xl h-[80%] flex flex-col justify-between bg-transparent 
        ${
          darkMode
            ? " text-white"
            : " text-gray-900"
        }
        transition-all duration-300
      `}
    >
      
      <div className="text-center mb-16">
        <h2
          className={`text-5xl font-bold tracking-tight mb-3 ${
            darkMode
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          Top 3
        </h2>
        <div className={`w-16 h-1 mx-auto ${darkMode ? "bg-indigo-500" : "bg-indigo-600"}`}></div>
      </div>

      
      <div className="flex justify-center items-end gap-6 sm:gap-8 lg:gap-16 pb-8">
        {positions.map((pos) => {
          const student = displayOrder[pos.index];
          const isFirst = pos.label === "1st";

          return (
            <div
              key={pos.label}
              className={`relative flex flex-col items-center ${
                isFirst ? "z-10 scale-105" : "z-0"
              }`}
            >
              
              {isFirst && (
                <div className="absolute -top-12 text-4xl">👑</div>
              )}

              
              <div
                className={`
                  w-16 h-16 rounded-full mb-[-1.5rem] z-20
                  flex items-center justify-center text-2xl font-semibold
                  ${pos.medal.avatar} ${pos.medal.text}
                  ${darkMode ? "shadow-lg" : "shadow-md border-2 border-gray-100"}
                `}
              >
                {student.name.charAt(0)}
              </div>

              
              <div
                className={`
                  ${pos.size} flex flex-col items-center justify-end pb-5 rounded-t-2xl
                  ${pos.medal.bg}
                  transition-all duration-300 hover:scale-105
                `}
              >
                
                <div className={`
                  mb-3 px-4 py-1.5 rounded-full text-base font-semibold
                  ${darkMode ? "bg-black/20 text-white" : "bg-white/60 text-gray-900"}
                `}>
                  {student.score}%
                </div>

                
                <div className={`
                  w-[85%] text-center text-sm font-medium truncate py-2.5 rounded-lg
                  ${darkMode ? "bg-zinc-900 text-white" : "bg-white text-gray-900 shadow-sm"}
                `}>
                  {student.name}
                </div>
              </div>

              
              <div className={`mt-4 text-sm font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {pos.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}