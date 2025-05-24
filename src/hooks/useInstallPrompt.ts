// 👉 Code spécifique à la version prod pour l’installation PWA

import { useEffect, useState } from "react";

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault(); // empêche Chrome d’afficher l’invite automatiquement
      setDeferredPrompt(e); // on le stocke
      setIsVisible(true); // on peut alors afficher un bouton
    };

    window.addEventListener("beforeinstallprompt", handler as any);
    return () =>
      window.removeEventListener("beforeinstallprompt", handler as any);
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`🟢 Résultat de l'installation : ${outcome}`);
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  return { isVisible, promptInstall };
}
