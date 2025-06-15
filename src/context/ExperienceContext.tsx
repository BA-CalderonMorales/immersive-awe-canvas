
import { createContext, useState, useMemo, ReactNode } from 'react';

type Theme = 'day' | 'night';

interface ExperienceContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export const ExperienceProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('night');

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
