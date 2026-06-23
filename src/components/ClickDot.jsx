import { useEffect, useState, useCallback } from "react";

const ClickDot = () => {
  const [dots, setDots] = useState([]);

  const handleClick = useCallback((e) => {
    const id = Date.now() + Math.random();
    const dot = {
      id,
      x: e.clientX,
      y: e.clientY,
    };

    setDots((prev) => [...prev, dot]);

    // Remove dot after animation completes
    setTimeout(() => {
      setDots((prev) => prev.filter((d) => d.id !== id));
    }, 600);
  }, []);

  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [handleClick]);

  return (
    <div className="click-dot-container">
      {dots.map((dot) => (
        <span
          key={dot.id}
          className="click-dot"
          style={{
            left: dot.x,
            top: dot.y,
          }}
        />
      ))}
    </div>
  );
};

export default ClickDot;
