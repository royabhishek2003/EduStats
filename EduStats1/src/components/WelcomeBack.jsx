import { useEffect, useState } from "react";

export default function WelcomeBack({ name = "User", darkMode }) {
  const [typedName, setTypedName] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setTypedName("");
    setIndex(0);
  }, [name]);

  useEffect(() => {
    if (index >= name.length) return;

    const timeout = setTimeout(() => {
      setTypedName((prev) => prev + name[index]);
      setIndex((prev) => prev + 1);
    }, 80);

    return () => clearTimeout(timeout);
  }, [index, name]);

  return (
    <div className="mb-16">
      <h1
        className={`text-5xl font-medium tracking-tight mb-4 ${
          darkMode ? "text-white" : "text-black"
        }`}
      >
        Welcome back,{" "}
        <span
          className={`font-bold ${
            darkMode ? "text-indigo-400" : "text-indigo-600"
          }`}
        >
          {typedName}
          <span className="ml-2 animate-pulse">|</span>
        </span>
      </h1>

      <p
        className={`text-lg ${
          darkMode ? "text-zinc-500" : "text-gray-500"
        }`}
      >
        Ready to explore your educational insights?
      </p>
    </div>
  );
}
