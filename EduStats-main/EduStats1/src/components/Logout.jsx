import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useIsLoggedIn } from "../stores/IsLoggedInStore";

export default function Logout() {
  const logout = useIsLoggedIn((s) => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/logout", {
          method: "POST",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          logout();
          toast.success("Logged out successfully!");
          setTimeout(() => navigate("/login"), 1500);
        } else {
          toast.error(data.message || "Logout failed. Try again.");
        }
      } catch (error) {
        console.error("Logout error:", error);
        toast.error("Something went wrong. Please try again.");
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h2 className="text-2xl font-semibold text-gray-700">Logging you out...</h2>
      <p className="text-gray-500 mt-2">Please wait a moment.</p>
    </div>
  );
}
