
interface FloatingElementsProps {
  theme: 'day' | 'night';
}

const FloatingElements = ({ theme }: FloatingElementsProps) => {
  return (
    <>
      {/* Floating trees for day mode */}
      {theme === 'day' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-8 h-12 opacity-20 animate-bounce-slow [animation-delay:0s]">
            🌲
          </div>
          
          <div className="absolute top-1/3 right-1/3 w-6 h-10 opacity-15 animate-bounce-slow [animation-delay:1s]">
            🌳
          </div>
          
          <div className="absolute bottom-1/3 left-1/5 w-7 h-11 opacity-25 animate-bounce-slow [animation-delay:2s]">
            🌲
          </div>
          
          <div className="absolute top-1/2 right-1/4 w-5 h-9 opacity-10 animate-bounce-slow [animation-delay:1.5s]">
            🌿
          </div>
        </div>
      )}

      {/* Moon for night mode */}
      {theme === 'night' && (
        <div className="absolute top-1/4 right-1/4 w-16 h-16 opacity-30 animate-pulse pointer-events-none">
          🌙
        </div>
      )}
    </>
  );
};

export default FloatingElements;
