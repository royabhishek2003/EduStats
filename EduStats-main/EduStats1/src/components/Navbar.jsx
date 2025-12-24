import { NavLink, useNavigate } from "react-router-dom";
import { useThemeStore } from "../stores/ThemeStore";
import { useIsLoggedIn } from "../stores/IsLoggedInStore";
import { useResultStore } from "../stores/ResultStore";
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Menu,
  Home,
  BarChart3,
  Info,
  Phone,
  LogOut,
  LogIn,
  UserPlus,
  Moon,
  Sun,
  Award,
  User,
} from "lucide-react";

export default function Sidebar() {
  const clearResults = useResultStore((s) => s.clearResults);
  const darkMode = useThemeStore((s) => s.darkMode);
  const toggleDarkMode = useThemeStore((s) => s.toggleDarkMode);

  const isLoggedIn = useIsLoggedIn((s) => s.isLoggedIn);
  const logout = useIsLoggedIn((s) => s.logout);
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        logout();
        clearResults();
        toast.success("Logged out successfully");
        setTimeout(() => navigate("/login"), 800);
      } else toast.error("Logout failed");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const textClass = `
    overflow-hidden whitespace-nowrap transition-all duration-200
    ${expanded ? "w-40 ml-3" : "w-0"}
  `;

  const navBase =
    "flex items-center p-3 rounded-xl transition-all duration-200";

  const getNavLinkClass = ({ isActive }) =>
    `${navBase} ${
      isActive
        ? darkMode
          ? "bg-indigo-500/15 text-indigo-400"
          : "bg-indigo-50 text-indigo-700"
        : darkMode
        ? "text-zinc-400 hover:bg-zinc-800 hover:text-white"
        : "text-gray-600 hover:bg-gray-100 hover:text-black"
    }`;

  const navItems = [
  { to: "/home", label: "Home", icon: <Home size={20} /> },
  { to: "/results", label: "Results", icon: <Award size={20} /> },

  ...(isLoggedIn
    ? [
        { to: "/dashboard", label: "Dashboard", icon: <BarChart3 size={20} /> },
      ]
    : []),

  { to: "/about", label: "About", icon: <Info size={20} /> },
  { to: "/contact", label: "Contact", icon: <Phone size={20} /> },
    ...(isLoggedIn
    ? [
        {to:'/profile',label:'Profile',icon:<User size={20}/>},
      ]
    : []),

];

  return (
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`
        sticky top-0 flex-shrink-0 z-50 h-screen flex flex-col select-none
        transition-all duration-300 overflow-hidden
        ${expanded ? "w-64" : "w-16"}
        ${darkMode ? "bg-zinc-900" : "bg-white"}
      `}
    >
      <div className="flex items-center gap-3 px-4 py-4">
        <Menu size={26} className={darkMode ? "text-white" : "text-black"} />
        <span
          className={`
            text-xl tracking-widest font-medium
            overflow-hidden whitespace-nowrap transition-all duration-200
            ${expanded ? "w-44" : "w-0"}
            ${darkMode ? "text-white" : "text-black"}
          `}
        >
          EduStats
        </span>
      </div>

      <nav className="flex flex-col gap-1 px-2 mt-2">
        {navItems.map((item, i) => (
          <NavLink key={i} to={item.to} className={getNavLinkClass}>
            {item.icon}
            <span className={textClass}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2 px-2 pb-6">
        {!isLoggedIn ? (
          <>
            <NavLink to="/login" className={getNavLinkClass}>
              <LogIn size={20} />
              <span className={textClass}>Login</span>
            </NavLink>

            <NavLink
              to="/signup"
              className={`${navBase} ${
                darkMode
                  ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                  : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              }`}
            >
              <UserPlus size={20} />
              <span className={textClass}>Signup</span>
            </NavLink>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className={`${navBase} cursor-pointer text-red-500 bg-red-500/30 hover:bg-red-500/10`}
          >
            <LogOut size={20} />
            <span className={textClass}>Logout</span>
          </button>
        )}

        <button
          onClick={toggleDarkMode}
          className={`${navBase} ${
            darkMode
              ? "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-black"
          }`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span className={textClass}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </span>

          {expanded && (
            <div
              className={`ml-auto w-10 h-5 flex items-center rounded-full p-0.5 transition ${
                darkMode ? "bg-indigo-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  darkMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}