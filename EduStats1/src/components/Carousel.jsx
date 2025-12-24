import { useEffect, useState } from "react";

const images = [
  {
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    title: "Visualize Performance",
    subtitle: "Clean charts and real insights",
  },
  {
    src: "https://images.unsplash.com/photo-1581090700227-1e37b190418e",
    
    title: "Track Progress",
    subtitle: "Monitor student growth effortlessly",
  },
  {
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998",
    title: "Smart Analytics",
    subtitle: "Make data-driven decisions",
  },
];

export default function Carousel({ darkMode = false }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`relative w-full h-full rounded-lg overflow-hidden ${
      darkMode ? "bg-zinc-900" : "bg-zinc-700"
    }`}>
      {images.map((img, i) => (
        <div
          key={i}
          className={`
            absolute inset-0 transition-opacity duration-1000 ease-in-out
            ${i === index ? "opacity-100" : "opacity-0"}
          `}
        >
          <img
            src={img.src}
            alt={img.title}
            className="w-full h-full object-cover opacity-60"
          />

          
          <div className={`absolute inset-0 ${
            darkMode 
              ? 'bg-gradient-to-t from-zinc-900/90 to-zinc-900/20 ' 
              : 'bg-gradient-to-t from-zinc/70 to-zinc/10 '
          }`} />

          
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className={`text-xl font-light tracking-wide mb-1 ${
              darkMode ? 'text-zinc-100' : 'text-zinc-200'
            }`}>
              {img.title}
            </h3>
            <p className={`text-xs font-light ${
              darkMode ? 'text-zinc-400' : 'text-zinc-200'
            }`}>
              {img.subtitle}
            </p>
          </div>
        </div>
      ))}

      
      <div className="absolute bottom-6 right-6 flex gap-1.5">
        {images.map((_, i) => (
          <span
            key={i}
            className={`h-1 w-1 rounded-full transition-all duration-300 ${
              i === index 
                ? darkMode ? 'bg-zinc-100 w-4' : 'bg-zinc-900 w-4'
                : darkMode ? 'bg-zinc-600' : 'bg-zinc-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}