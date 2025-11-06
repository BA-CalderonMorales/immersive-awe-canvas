import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./components/scene/objects/geometries";

createRoot(document.getElementById("root")!).render(<App />);
