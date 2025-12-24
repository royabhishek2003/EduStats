import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();

  const fetchAuthStatus = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/home", {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 200) {
        setAuth(true);
      } else {
        setAuth(false);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setAuth(false);
    }
  };

  useEffect(() => {
    fetchAuthStatus();
  }, []);

  useEffect(() => {
    if (auth === false) {
      toast.error("Please login first");
      setTimeout(() => {
        navigate("/login");
      }, 100);
    }
  }, [auth]);

  if (auth === null) {
    return <div>Loading...</div>;
  }

  return children;
}
