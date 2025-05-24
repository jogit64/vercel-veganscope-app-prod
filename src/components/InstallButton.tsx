// 👉 Code spécifique à la version prod pour l’installation PWA

import React from "react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { Button } from "@/components/ui/button";

export const InstallButton = () => {
  const { isVisible, promptInstall } = useInstallPrompt();

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button onClick={promptInstall}>📲 Ajouter VeganScope à l'accueil</Button>
    </div>
  );
};
