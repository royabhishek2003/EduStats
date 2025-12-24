import { useState } from "react";
import { useThemeStore } from "../stores/ThemeStore";
import { useResultStore } from "../stores/ResultStore";
import { useNavigate } from "react-router-dom";
import { useIsLoggedIn } from "../stores/IsLoggedInStore";
import {
  User,
  FileText,
  Hash,
  BarChart3,
  Send,
  Plus,
  Type,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ManualEntry() {
  const user = useIsLoggedIn((s) => s.user);
  const setResults = useResultStore((s) => s.setResults);
  const darkMode = useThemeStore((s) => s.darkMode);
  const navigate = useNavigate();

  const [vizName, setVizName] = useState("");
  const [count, setCount] = useState("");
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputClass = `
    w-full px-4 py-3 rounded-xl border outline-none transition
    ${
      darkMode
        ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-indigo-500"
        : "bg-gray-50 border-gray-300 placeholder:text-gray-400 focus:border-indigo-500"
    }
  `;

  const createForm = () => {
    if (!vizName.trim()) return toast.error("Enter a visualization name");
    if (!count || count < 1) return toast.error("Enter a valid number");

    const arr = Array.from({ length: Number(count) }, () => ({
      id: crypto.randomUUID(),
      name: "",
      subject: "",
      marks: "",
      totalMarks: "",
      remarks: "",
    }));

    setStudents(arr);
  };

  const handleChange = (id, field, value) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!vizName.trim()) return toast.error("Visualization name is required");
    if (students.some((s) => !s.name || !s.subject || !s.marks))
      return toast.error("Fill all required fields");

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/manual-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vizName, students, user }),
      });

      const data = await res.json();

      if (res.ok) {
        setResults(data);
        toast.success("Saved successfully");
        navigate("/results");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen px-6 py-16 flex justify-center ${
        darkMode ? "bg-zinc-950" : "bg-gray-50"
      }`}
    >
      {!students.length ? (
        
        <div
          className={`w-full max-w-xl rounded-2xl p-10 ${
            darkMode
              ? "bg-zinc-900"
              : "bg-white shadow-sm"
          }`}
        >
          <h1
            className={`text-3xl font-light mb-8 text-center ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            Create New Visualization
          </h1>

          <div className="relative mb-5">
            <Type className="absolute left-3 top-3 text-indigo-400" />
            <input
              type="text"
              placeholder="Visualization name"
              className={`${inputClass} pl-10`}
              value={vizName}
              onChange={(e) => setVizName(e.target.value)}
            />
          </div>

          <div className="relative mb-6">
            <Plus className="absolute left-3 top-3 text-indigo-400" />
            <input
              type="number"
              placeholder="Number of students"
              className={`${inputClass} pl-10`}
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
          </div>

          <button
            onClick={createForm}
            className={`w-full py-3 rounded-xl font-medium transition ${
              darkMode
                ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            }`}
          >
            Generate Forms
          </button>
        </div>
      ) : (
        
        <form
          onSubmit={handleSubmit}
          className={`w-full max-w-6xl rounded-2xl p-10 ${
            darkMode
              ? "bg-zinc-900"
              : "bg-white shadow-sm"
          }`}
        >
          <div className="relative text-center mb-10">
            <button
              type="button"
              onClick={() => setStudents([])}
              className="absolute left-0 top-1 p-2 rounded-full hover:bg-zinc-800"
            >
              <ChevronLeft />
            </button>

            <h2
              className={`text-3xl font-light ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              {vizName}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {students.map((s, i) => (
              <div
                key={s.id}
                className={`rounded-xl p-6 ${
                  darkMode
                    ? "bg-zinc-800/60"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <h3
                  className={`text-lg font-medium mb-4 ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                >
                  Student #{i + 1}
                </h3>

                {[
                  { label: "Name", icon: User, field: "name" },
                  { label: "Subject", icon: FileText, field: "subject" },
                  { label: "Marks", icon: Hash, field: "marks" },
                  { label: "Total Marks", icon: BarChart3, field: "totalMarks" },
                ].map(({ label, icon: Icon, field }) => (
                  <div key={field} className="mb-4">
                    <label className={`block mb-1 text-sm ${darkMode ? 'text-white':'text-black'} `}>{label}</label>
                    <div className="relative">
                      <Icon className={`absolute left-3 top-3 ${darkMode ? 'text-white':'text-black'} `} />
                      <input
                        type="text"
                        className={`${inputClass} pl-10`}
                        value={s[field]}
                        onChange={(e) =>
                          handleChange(s.id, field, e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}

                <textarea
                  rows="3"
                  placeholder="Remarks (optional)"
                  className={`${inputClass} resize-none`}
                  value={s.remarks}
                  onChange={(e) =>
                    handleChange(s.id, "remarks", e.target.value)
                  }
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-10 w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition ${
              darkMode
                ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Saving…
              </>
            ) : (
              <>
                <Send size={18} /> Save Visualization
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
