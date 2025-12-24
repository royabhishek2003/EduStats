import { NavLink } from "react-router-dom";
import { useIsLoggedIn } from "../stores/IsLoggedInStore";
import { useThemeStore } from "../stores/ThemeStore";

export default function Landing() {
  const isLoggedIn = useIsLoggedIn((s) => s.isLoggedIn);
  const darkMode = useThemeStore((s) => s.darkMode);

  return (
    <div
      className={`min-h-screen flex flex-col justify-between items-center transition-colors ${
        darkMode ? "bg-zinc-950 text-white" : "bg-gray-50 text-black"
      }`}
    >
      
      <header
        className={`fixed top-0 left-0 w-full z-40 backdrop-blur-md border-b transition ${
          darkMode
            ? "bg-zinc-900/70 border-zinc-800"
            : "bg-white/70 border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 h-[72px] flex items-center justify-between">
          <span
            className={`text-xl tracking-wide font-semibold ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            EduStats
          </span>

          <nav
            className={`hidden md:flex gap-10 text-sm ${
              darkMode ? "text-zinc-400" : "text-gray-600"
            }`}
          >
            <NavLink to="/home" className="hover:text-indigo-400 transition">
              Home
            </NavLink>
            <NavLink to="/about" className="hover:text-indigo-400 transition">
              About
            </NavLink>
            <NavLink to="/contact" className="hover:text-indigo-400 transition">
              Contact
            </NavLink>
          </nav>

          <NavLink
            to={isLoggedIn ? "/home" : "/signup"}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
              darkMode
                ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            }`}
          >
            {isLoggedIn ? "Dashboard" : "Get Started"}
          </NavLink>
        </div>
      </header>

      
      <section className="mt-60 -translate-y-[10%] pb-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1
            className={`text-5xl md:text-7xl font-light tracking-tight mb-6 ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            Transform the way you understand{" "}
            <span className="text-mainBlue">education data</span>.
          </h1>

          <p
            className={`max-w-2xl mx-auto text-lg leading-relaxed ${
              darkMode ? "text-zinc-500" : "text-gray-600"
            }`}
          >
            EduStats helps students and educators transform raw academic data
            into meaningful insights, trends, and performance metrics —
            effortlessly.
          </p>

          <div className="flex justify-center gap-4 mt-12">
            <NavLink
              to="/home"
              className="px-8 py-3 rounded-xl text-sm font-medium transition
              bg-indigo-500 text-white hover:bg-indigo-600"
            >
              Explore Dashboard
            </NavLink>

            <NavLink
              to="/contact"
              className={`px-8 py-3 rounded-xl text-sm font-medium transition ${
                darkMode
                  ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Contact Us
            </NavLink>
          </div>
        </div>
      </section>

     
      <footer
        className={`text-center text-sm pb-10 ${
          darkMode ? "text-zinc-600" : "text-gray-500"
        }`}
      >
        Built for clarity • Designed for focus
      </footer>
    </div>
  );
}
