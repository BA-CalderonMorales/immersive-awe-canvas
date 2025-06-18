
import { createContext, useState, useMemo, ReactNode, useEffect } from 'react';

type Theme = 'day' | 'night';

interface ExperienceContextType {
  
  theme: Theme;
  toggleTheme: () => void;

}

export const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export const ExperienceProvider = ({ children }: { children: ReactNode }) => {

  const [theme, setTheme] = useState<Theme>(() => {
  
    // On initial load, try to get the theme from localStorage
    const savedTheme = typeof window !== 'undefined' ? (localStorage.getItem('theme') as Theme | null) : null;
    return savedTheme || 'night'; // Default to 'night' if nothing is saved
  
  });

  // When theme changes, update localStorage
  useEffect(() => {
  
    localStorage.setItem('theme', theme);
  
  }, [theme]);

  const toggleTheme = () => {
  
    setTheme((prevTheme) => (prevTheme === 'night' ? 'day' : 'night'));
  
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
  
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  
  );

};

