import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("🔥 VITE_SUPABASE_URL", import.meta.env.VITE_SUPABASE_URL);
console.log(
  "🔥 VITE_SUPABASE_ANON_KEY",
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
console.log("🔥 VITE_TMDB_API_KEY", import.meta.env.VITE_TMDB_API_KEY);

createRoot(document.getElementById("root")!).render(<App />);
