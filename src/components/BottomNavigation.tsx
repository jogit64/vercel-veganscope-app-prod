import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Film, Tv, Star, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    {
      name: "Accueil",
      path: "/",
      icon: Home,
    },
    {
      name: "Films",
      path: "/movies",
      icon: Film,
    },
    {
      name: "Séries",
      path: "/tv",
      icon: Tv,
    },
    {
      name: "Avis",
      path: "/evaluations",
      icon: Star,
    },
    {
      name: "Favoris",
      path: "/favorites",
      icon: Heart,
    },
  ];

  const isActive = (itemPath: string) => {
    if (itemPath === "/" && path === "/") return true;
    if (itemPath !== "/" && path.startsWith(itemPath)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-2 py-2 flex justify-around items-center z-10">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "bottom-nav-item p-2",
            isActive(item.path) ? "active" : "text-gray-500 dark:text-gray-400"
          )}
        >
          <item.icon className="h-5 w-5 mb-1" />
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNavigation;
