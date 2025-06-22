import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const setViewportUnits = () => {
  const root = document.documentElement
  root.style.setProperty('--app-height', `${window.innerHeight}px`)
  root.style.setProperty('--app-width', `${window.innerWidth}px`)
}

setViewportUnits()
window.addEventListener('resize', setViewportUnits)

createRoot(document.getElementById("root")!).render(<App />);
