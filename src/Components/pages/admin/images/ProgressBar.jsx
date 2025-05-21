import { useState, useEffect } from "react";

const ProgressBar = ({ t }) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const animationDuration = 5000;
    let startTime = null;
    let animationFrameId = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progressRatio = Math.min(elapsed / animationDuration, 1);
      const currentProgress = progressRatio * 100;

      setDisplayProgress(currentProgress);

      if (progressRatio < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayProgress(100);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 animate-pulse duration-200 transition-all">
      <div
        className="bg-primary h-2.5 rounded-full transition-all duration-100"
        style={{ width: `${displayProgress}%` }}
      />
      <div className="text-sm text-gray-600 mt-1">
        {Math.round(displayProgress)}% {t("loading_key")}
      </div>
    </div>
  );
};

export default ProgressBar;
