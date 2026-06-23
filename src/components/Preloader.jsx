import React, { useEffect, useState } from "react";

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Block scroll during load
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    // Artificial progress loader that slows down as it gets closer to 90%
    let interval;
    const startProgress = () => {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          // Faster at first, then slows down
          const increment = prev < 50 ? 5 : 2;
          return prev + increment;
        });
      }, 40);
    };

    startProgress();

    // When window is fully loaded
    const handleLoad = () => {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 700); // match transition duration
      }, 400); // hold 100% briefly
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    // Safety timeout in case load event takes too long or some assets fail to notify
    const safetyTimeout = setTimeout(() => {
      handleLoad();
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimeout);
      window.removeEventListener("load", handleLoad);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#010103] transition-all duration-700 ease-in-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center gap-6">
        {/* Sleek logo/initial avatar with double spin loaders */}
        <div className="relative flex items-center justify-center w-24 h-24">
          {/* Inner pulse */}
          <div className="absolute inset-0 rounded-full bg-orange-500/10 animate-ping" />
          
          {/* Main glowing spinning ring */}
          <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-orange-500 border-r-transparent animate-spin [animation-duration:1000ms]" />
          
          {/* Inner ring spinning backwards */}
          <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-white/20 border-l-transparent animate-spin [animation-duration:700ms] [animation-direction:reverse]" />

          {/* Letter initials 'OA' in the center */}
          <span className="text-3xl font-extrabold text-white tracking-widest font-sans select-none animate-pulse">
            OA
          </span>
        </div>

        {/* Text and Percentage */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-semibold select-none">
            Loading Experience
          </p>
          <div className="flex items-baseline justify-center gap-1 font-mono text-2xl font-bold text-white">
            <span className="w-12 text-right">{progress}</span>
            <span className="text-orange-500 text-lg">%</span>
          </div>
        </div>

        {/* Modern sleek progress track */}
        <div className="h-[2px] w-48 bg-white/5 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
