
import { useRef, useEffect } from "react";
import anime from "animejs";

interface MainTitleProps {
  theme: 'day' | 'night';
}

const MainTitle = ({ theme }: MainTitleProps) => {
  const textRef = useRef<HTMLHeadingElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Animate main title
    if (textRef.current) {
      anime({
        targets: textRef.current,
        translateY: [-40, 0],
        opacity: [0, 1],
        easing: "easeOutBack",
        duration: 1200,
        delay: 120,
      });
    }
    
    // Animate subtitle
    if (subTextRef.current) {
      anime({
        targets: subTextRef.current,
        opacity: [0, 0.85],
        translateY: [22, 0],
        delay: 800,
        duration: 900,
        easing: "easeOutQuad",
      });
    }
  }, []);

  return (
    <div className="text-center select-none pointer-events-none mb-8">
      <h1 
        ref={textRef}
        className={`text-5xl md:text-7xl font-bold mb-4 opacity-0 transition-all duration-1000 ${
          theme === 'day' 
            ? 'text-emerald-800 [text-shadow:0_0_20px_rgba(16,185,129,0.3)]' 
            : 'text-blue-100 mix-blend-difference [text-shadow:0_0_20px_rgba(147,197,253,0.4)]'
        }`}
      >
        Immersive Awe Canvas
      </h1>
      <p
        ref={subTextRef}
        className={`mt-4 text-xl transition-all duration-1000 opacity-0 ${
          theme === 'day'
            ? 'text-emerald-700 [text-shadow:0_0_15px_rgba(16,185,129,0.2)]'
            : 'text-blue-200 mix-blend-difference [text-shadow:0_0_15px_rgba(147,197,253,0.3)]'
        }`}
      >
        The Journey Awaits
      </p>
    </div>
  );
};

export default MainTitle;
