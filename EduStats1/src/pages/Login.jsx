import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { useIsLoggedIn } from "../stores/IsLoggedInStore";
import { useThemeStore } from "../stores/ThemeStore";
import { Eye, EyeOff, ArrowUpRight, Mail, Lock } from "lucide-react";

export default function Login() {
  const darkMode = useThemeStore((s) => s.darkMode);
  const isLoggedIn = useIsLoggedIn((s) => s.isLoggedIn);
  const login = useIsLoggedIn((s) => s.login);
  const user = useIsLoggedIn((s) => s.user);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [responseData, setResponseData] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResponseData(data);
      if (res.ok) {
        toast.success("Login Successful!");
        login(data.user);
        setFormData({ email: "", password: "" });
        setTimeout(() => navigate("/home"), 2000);
      } else {
        toast.error(data.message || "Login Failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    console.log("state changed: ", isLoggedIn);
    console.log("user: ", user);
  }, [isLoggedIn, user]);

  return (
    <div
      className={`relative flex w-full items-center justify-center min-h-screen overflow-hidden transition-colors duration-500 ${
        darkMode ? "bg-[#0a0a0a]" : "bg-gray-50"
      }`}
    >
     
      <div className={`absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none`}>
         <div className={`absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full blur-[120px] opacity-20 ${darkMode ? 'bg-indigo-900' : 'bg-blue-200'}`} />
         <div className={`absolute bottom-[-10%] right-[-5%] w-96 h-96 rounded-full blur-[120px] opacity-20 ${darkMode ? 'bg-blue-900' : 'bg-indigo-200'}`} />
      </div>

      <div
        className={`relative z-10 w-full max-w-[400px] p-8 rounded-2xl border transition-all duration-300 ${
          darkMode
            ? "bg-neutral-900/80 border-neutral-800 shadow-2xl shadow-black/40 backdrop-blur-sm"
            : "bg-white border-gray-100 shadow-xl shadow-gray-200/50"
        }`}
      >
        <div className="mb-8">
          <h2
            className={`text-2xl font-semibold tracking-tight ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Welcome back
          </h2>
          <p
            className={`mt-2 text-sm ${
              darkMode ? "text-neutral-400" : "text-gray-500"
            }`}
          >
            Enter your details to access your account
          </p>
        </div>

        
        <a
          href="http://localhost:3000/api/auth/google"
          className={`flex items-center justify-center gap-3 w-full py-2.5 rounded-lg border text-sm font-medium transition-colors duration-200 ${
            darkMode
              ? "bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700"
              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 48 48">
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.657-3.657-11.303-8.666l-6.571,4.82C9.656,39.663,16.318,44,24,44z"
            />
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.089,5.571l6.19,5.238C39.99,36.636,44,30.823,44,24C44,22.659,43.862,21.34,43.611,20.083z"
            />
          </svg>
          Google
        </a>

       
        <div className="relative flex py-6 items-center">
          <div className={`flex-grow border-t ${darkMode ? "border-neutral-800" : "border-gray-200"}`}></div>
          <span className={`flex-shrink-0 mx-3 text-[11px] font-medium uppercase tracking-widest ${darkMode ? "text-neutral-500" : "text-gray-400"}`}>
            Or with email
          </span>
          <div className={`flex-grow border-t ${darkMode ? "border-neutral-800" : "border-gray-200"}`}></div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
         
          <div className="space-y-1.5">
            <label className={`text-xs font-medium ml-1 ${darkMode ? "text-neutral-300" : "text-gray-700"}`}>
              Email Address
            </label>
            <div className="relative group">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${darkMode ? "text-neutral-500 group-focus-within:text-neutral-300" : "text-gray-400 group-focus-within:text-gray-600"}`}>
                <Mail size={16} />
              </div>
              <input
                onChange={handleChange}
                type="email"
                name="email"
                value={formData.email}
                placeholder="name@example.com"
                className={`w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm transition-all duration-200 outline-none
                  ${
                    darkMode
                      ? "bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-600 focus:border-neutral-500 focus:bg-neutral-800"
                      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-0"
                  }
                `}
              />
            </div>
          </div>

          
          <div className="space-y-1.5">
             <div className="flex justify-between items-center ml-1">
              <label className={`text-xs font-medium ${darkMode ? "text-neutral-300" : "text-gray-700"}`}>
                Password
              </label>
              <a href="#" className={`text-xs font-medium transition-colors ${darkMode ? "text-neutral-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}>
                Forgot?
              </a>
            </div>
            <div className="relative group">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${darkMode ? "text-neutral-500 group-focus-within:text-neutral-300" : "text-gray-400 group-focus-within:text-gray-600"}`}>
                <Lock size={16} />
              </div>
              <input
                onChange={handleChange}
                name="password"
                type={passwordVisible ? "text" : "password"}
                value={formData.password}
                placeholder="Enter password"
                className={`w-full pl-9 pr-9 py-2.5 rounded-lg border text-sm transition-all duration-200 outline-none
                  ${
                    darkMode
                      ? "bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-600 focus:border-neutral-500 focus:bg-neutral-800"
                      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-0"
                  }
                `}
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className={`absolute inset-y-0 right-3 flex items-center transition-colors ${
                  darkMode ? "text-neutral-500 hover:text-neutral-300" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all duration-200
                ${
                  darkMode
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-black text-white hover:bg-gray-800"
                }
              `}
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className={`text-sm ${darkMode ? "text-neutral-500" : "text-gray-500"}`}>
            No account?{" "}
            <NavLink
              to="/signup"
              className={`font-medium inline-flex items-center gap-0.5 transition-colors ${
                darkMode ? "text-white hover:text-gray-300" : "text-black hover:text-gray-700"
              }`}
            >
              Sign up
              <ArrowUpRight size={14} />
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}