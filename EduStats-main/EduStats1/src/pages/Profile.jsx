import { useThemeStore } from "../stores/ThemeStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Loader2,
  User,
  ShieldCheck,
  CalendarDays,
  Activity,
  LogOut,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Profile() {
  const darkMode = useThemeStore((s) => s.darkMode);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [visualizations, setVisualizations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/profile", {
          credentials: "include",
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setUser(data.user);
        setVisualizations(data.visualizations || []);
      } catch {
        toast.error("Please login again");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await fetch("http://localhost:3000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    toast.success("Logged out");
    navigate("/login");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (!user) return null;

  const joinedDate = new Date(user.createdAt);

  return (
    <div
      className={`min-h-screen px-6 py-16 ${
        darkMode ? "bg-zinc-950 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <div
        className={`max-w-5xl mx-auto rounded-3xl p-10 border ${
          darkMode
            ? "bg-zinc-900 border-zinc-800"
            : "bg-white border-gray-200 shadow-sm"
        }`}
      >
        {/* ================= HEADER ================= */}
        <div className="flex items-center gap-8 mb-14">
          <div
            className={`w-28 h-28 rounded-full flex items-center justify-center text-4xl font-semibold ${
              darkMode
                ? "bg-indigo-500/20 text-indigo-400"
                : "bg-indigo-100 text-indigo-700"
            }`}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-4xl font-light">{user.name}</h1>
            <p className="text-zinc-500">{user.email}</p>

            <div className="flex items-center gap-3 mt-3 text-sm">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                Active
              </span>
              <span className="text-zinc-500">Student</span>
            </div>
          </div>
        </div>

        {/* ================= ACCOUNT INFO ================= */}
        <Section title="Account Information" icon={<User />}>
          <InfoRow label="Full Name" value={user.name} />
          <InfoRow label="Email Address" value={user.email} />
          <InfoRow label="Joined On" value={joinedDate.toDateString()} />
          <InfoRow
            label="Member Since"
            value={`${Math.floor(
              (Date.now() - joinedDate) / (1000 * 60 * 60 * 24)
            )} days`}
          />
        </Section>

        {/* ================= ACTIVITY ================= */}
        <Section title="Activity & Usage" icon={<Activity />}>
          <InfoRow
            label="Dashboards Created"
            value={visualizations.length}
          />
          <InfoRow
            label="Total Visualizations"
            value={visualizations.length}
          />
          <InfoRow label="Last Active" value="Recently" />
        </Section>

        {/* ================= VISUALIZATIONS ================= */}
        <Section title="Your Visualizations" icon={<Activity />}>
          {visualizations.length === 0 ? (
            <p className="text-sm text-zinc-500 py-4">
              No visualizations created yet.
            </p>
          ) : (
            visualizations.map((viz) => (
              <div
                key={viz._id}
                className="flex justify-between items-center py-3 text-sm"
              >
                <div>
                  <p className="font-medium">{viz.vizName}</p>
                  <p className="text-xs text-zinc-500">
                    Created on {new Date(viz.createdAt).toDateString()}
                  </p>
                </div>
                <div className="text-zinc-500">
                  {viz.studentResults?.length || 0} students
                </div>
              </div>
            ))
          )}
        </Section>

        {/* ================= SECURITY ================= */}
        <Section title="Security" icon={<ShieldCheck />}>
          <InfoRow label="Login Method" value="Email & Password" />
          <InfoRow label="Session Status" value="Secure" />
          <button className="mt-4 px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20">
            Change Password
          </button>
        </Section>

        {/* ================= PREFERENCES ================= */}
        <Section title="Preferences" icon={<Settings />}>
          <InfoRow
            label="Theme"
            value={darkMode ? "Dark Mode" : "Light Mode"}
          />
          <InfoRow label="Notifications" value="Enabled" />
        </Section>

        {/* ================= ACTIONS ================= */}
        <div className="flex flex-col sm:flex-row gap-6 mt-14">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 p-5 rounded-2xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
          >
            Go to Dashboard
          </button>

          <button
            onClick={handleLogout}
            className="flex-1 p-5 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center gap-2"
          >
            <LogOut /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function Section({ title, icon, children }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4 text-indigo-400">
        {icon}
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      <div className="divide-y divide-zinc-800/50">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between py-3 text-sm">
      <span className="text-zinc-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}