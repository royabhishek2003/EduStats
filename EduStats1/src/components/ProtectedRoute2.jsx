import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsLoggedIn } from "../stores/IsLoggedInStore";
import toast from "react-hot-toast";

export default function ProtectedRoute2({ children }) {
  const isLoggedIn = useIsLoggedIn((s) => s.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
        toast.success('Navigating to Home page.')
        navigate("/home", { replace: true })
    };
  }, [isLoggedIn, navigate]);

  return !isLoggedIn ? children : null;
}
