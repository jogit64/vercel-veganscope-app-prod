import React, { useMemo, useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";

const LogoImage = () => {
  const { isDark } = useTheme();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Attend que le thème soit bien appliqué avant d'afficher le logo
    setHydrated(true);
  }, []);

  const logoSrc = useMemo(() => {
    if (!hydrated) return null;
    return isDark ? "/assets/logo-dark.png" : "/assets/logo-light.png";
  }, [isDark, hydrated]);

  if (!logoSrc) return null;

  return (
    <img
      src={logoSrc}
      alt="VeganScope logo"
      className="h-10 w-10 mt-1"
      key={logoSrc} // ← déclenche le re-render si la source change
    />
  );
};

export default LogoImage;
