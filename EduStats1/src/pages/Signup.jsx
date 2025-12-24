import { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { useThemeStore } from "../stores/ThemeStore";
import { useIsLoggedIn } from "../stores/IsLoggedInStore";
import { Eye, EyeOff, ArrowUpRight } from "lucide-react";

export default function Signup() {
  const darkMode = useThemeStore((s) => s.darkMode);
  const navigate = useNavigate();
  const login = useIsLoggedIn((s) => s.login);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Signup Successful! Please login to continue.");
        setFormData({ name: "", email: "", password: "" });
        setTimeout(() => navigate("/login"), 1200);
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-6 ${
        darkMode ? "bg-zinc-950" : "bg-gray-50"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-2xl p-8 border shadow-xl ${
          darkMode
            ? "bg-zinc-900 border-zinc-800"
            : "bg-white border-gray-200"
        }`}
      >
        <h2
          className={`text-3xl font-light tracking-tight text-center ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Create Account
        </h2>
        <p
          className={`text-sm text-center mt-2 mb-6 ${
            darkMode ? "text-zinc-500" : "text-gray-500"
          }`}
        >
          Join EduStats and unlock insights
        </p>

        <a
          href="http://localhost:3000/api/auth/google"
          className={`w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border transition ${
            darkMode
              ? "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
              : "bg-white border-gray-300 hover:bg-gray-50"
          }`}
        >
          <span className="text-sm font-medium">Sign up with Google</span>
        </a>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-zinc-700/40"></div>
          <span className="mx-4 text-xs text-zinc-500">or</span>
          <div className="flex-1 border-t border-zinc-700/40"></div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full name"
            className={`w-full rounded-xl px-4 py-3 outline-none border transition ${
              darkMode
                ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-indigo-500"
                : "bg-gray-50 border-gray-300 focus:border-indigo-500"
            }`}
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email address"
            className={`w-full rounded-xl px-4 py-3 outline-none border transition ${
              darkMode
                ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-indigo-500"
                : "bg-gray-50 border-gray-300 focus:border-indigo-500"
            }`}
          />

          <div className="relative">
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className={`w-full rounded-xl px-4 py-3 outline-none border transition ${
                darkMode
                  ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-indigo-500"
                  : "bg-gray-50 border-gray-300 focus:border-indigo-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute inset-y-0 right-3 text-zinc-400 hover:text-white"
            >
              {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl font-medium transition ${
              isSubmitting
                ? "bg-indigo-300 text-white cursor-not-allowed"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p
          className={`text-center text-sm mt-6 ${
            darkMode ? "text-zinc-500" : "text-gray-600"
          }`}
        >
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="inline-flex items-center gap-1 text-indigo-400 hover:underline"
          >
            Login <ArrowUpRight size={14} />
          </NavLink>
        </p>
      </div>
    </div>
  );
}
