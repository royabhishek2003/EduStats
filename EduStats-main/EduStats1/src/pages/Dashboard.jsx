import { useEffect, useState } from "react";
import { useThemeStore } from "../stores/ThemeStore";
import { useIsLoggedIn } from "../stores/IsLoggedInStore";
import { Eye, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {
  const darkMode = useThemeStore((s) => s.darkMode);
  const user = useIsLoggedIn((s) => s.user);
  const navigate = useNavigate();

  const [visuals, setVisuals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    const getData = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/visuals/${user.email}`
        );
        const data = await res.json();
        setVisuals(data.visualizations || []);
      } catch {
        toast.error("Failed to load visualizations");
      }
      setLoading(false);
    };

    getData();
  }, [user]);

  const confirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/deleteViz`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteId }),
      });

      if (res.ok) {
        setVisuals((p) => p.filter((v) => v._id !== deleteId));
        toast.success("Visualization deleted");
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Server error");
    }

    setShowModal(false);
    setDeleteId(null);
  };

  return (
    <div
      className={`min-h-screen px-6 py-16 transition-colors ${
        darkMode ? "bg-zinc-950" : "bg-gray-50"
      }`}
    >
      
      <div className="max-w-7xl mx-auto mb-14">
        <h1
          className={`text-4xl font-light tracking-tight mb-2 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Your Saved Visualizations
        </h1>
        <p
          className={`text-lg ${
            darkMode ? "text-zinc-500" : "text-gray-500"
          }`}
        >
          View, manage and explore your insights
        </p>
      </div>

      
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader2
            className={`w-10 h-10 animate-spin ${
              darkMode ? "text-white" : "text-black"
            }`}
          />
        </div>
      ) : visuals.length === 0 ? (
        <p
          className={`text-center text-lg ${
            darkMode ? "text-zinc-500" : "text-gray-500"
          }`}
        >
          No visualizations saved yet
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {visuals.map((viz) => (
            <div
              key={viz._id}
              className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 ${
                darkMode
                  ? "bg-zinc-900 hover:bg-zinc-900/80"
                  : "bg-white hover:bg-gray-50 shadow-sm hover:shadow-md"
              }`}
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 ${
                  darkMode ? "bg-indigo-500" : "bg-indigo-400"
                }`}
              ></div>

              <button
                onClick={() => {
                  setDeleteId(viz._id);
                  setShowModal(true);
                }}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100
                w-8 h-8 rounded-full flex items-center justify-center
                backdrop-blur bg-zinc-700/20 hover:bg-zinc-700/40
                text-zinc-400 hover:text-white transition"
              >
                ✕
              </button>

              <div className="relative">
                <h2
                  className={`text-xl font-medium mb-2 ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                >
                  {viz.vizName}
                </h2>

                <p
                  className={`text-sm ${
                    darkMode ? "text-zinc-500" : "text-gray-600"
                  }`}
                >
                  Students: {viz.studentResults.length}
                </p>

                <p
                  className={`text-sm mt-1 ${
                    darkMode ? "text-zinc-500" : "text-gray-600"
                  }`}
                >
                  Created{" "}
                  {new Date(viz.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

                <button
                  onClick={() => navigate(`/saved-results/${viz._id}`)}
                  className={`mt-5 w-full flex items-center justify-center gap-2 py-2 rounded-xl font-medium transition ${
                    darkMode
                      ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                      : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  }`}
                >
                  <Eye size={18} />
                  View Visualization
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div
            className={`w-[90%] max-w-md rounded-2xl p-8 ${
              darkMode ? "bg-zinc-900" : "bg-white"
            }`}
          >
            <h2
              className={`text-2xl font-medium mb-4 ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Delete Visualization?
            </h2>

            <p
              className={`mb-6 ${
                darkMode ? "text-zinc-500" : "text-gray-600"
              }`}
            >
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className={`px-4 py-2 rounded-xl transition ${
                  darkMode
                    ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
