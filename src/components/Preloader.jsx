import React, { useEffect, useState } from "react";
import * as THREE from "three";

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
    let interval;
    let completed3D = false;
    let completedWindow = false;

    // Artificial progress loader that slows down as it gets closer to 90%
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

    // Check if both page window load and 3D assets load are complete
    const checkCompletion = () => {
      if (completedWindow && completed3D) {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 700); // match transition duration
        }, 400); // hold 100% briefly
      }
    };

    // Hook into Three.js DefaultLoadingManager to track actual assets loading
    const originalOnStart = THREE.DefaultLoadingManager.onStart;
    const originalOnProgress = THREE.DefaultLoadingManager.onProgress;
    const originalOnLoad = THREE.DefaultLoadingManager.onLoad;

    THREE.DefaultLoadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
      completed3D = false;
      if (originalOnStart) originalOnStart(url, itemsLoaded, itemsTotal);
    };

    THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const pct = Math.round((itemsLoaded / itemsTotal) * 100);
      setProgress((prev) => Math.max(prev, Math.min(pct, 99)));
      if (originalOnProgress) originalOnProgress(url, itemsLoaded, itemsTotal);
    };

    THREE.DefaultLoadingManager.onLoad = () => {
      completed3D = true;
      checkCompletion();
      if (originalOnLoad) originalOnLoad();
    };

    // Fallback: if no 3D files load after 500ms, mark 3D complete
    const check3dIdle = setTimeout(() => {
      if (progress === 0 && !completed3D) {
        completed3D = true;
        checkCompletion();
      }
    }, 500);

    const handleLoad = () => {
      completedWindow = true;
      checkCompletion();
    };

    if (document.readyState === "complete") {
      completedWindow = true;
      checkCompletion();
    } else {
      window.addEventListener("load", handleLoad);
    }

    // Safety timeout in case load event takes too long or some assets fail to notify
    const safetyTimeout = setTimeout(() => {
      completedWindow = true;
      completed3D = true;
      checkCompletion();
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimeout);
      clearTimeout(check3dIdle);
      window.removeEventListener("load", handleLoad);
      // Restore original managers
      THREE.DefaultLoadingManager.onStart = originalOnStart;
      THREE.DefaultLoadingManager.onProgress = originalOnProgress;
      THREE.DefaultLoadingManager.onLoad = originalOnLoad;
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
