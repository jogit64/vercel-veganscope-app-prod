// 👉 Code spécifique à la version prod pour l’installation PWA

import React, { useState, useEffect } from "react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export const InstallButton = () => {
  const { isVisible, promptInstall } = useInstallPrompt();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // ✅ Affiche uniquement sur mobile
  const isMobile =
    typeof window !== "undefined" &&
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // ❌ Ne pas afficher si pas mobile, pas visible, ou déjà refusé
  if (!isMobile || !isVisible || dismissed) return null;

  // ✅ Délai d'affichage pour ne pas être intrusif
  useEffect(() => {
    const timer = setTimeout(() => setShowPrompt(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 
                     w-11/12 max-w-sm p-4 rounded-xl shadow-xl 
                     border bg-white text-gray-900 
                     dark:bg-zinc-900 dark:text-white dark:border-zinc-700"
        >
          <p className="text-sm text-center mb-3">
            Installer{" "}
            <span className="font-semibold text-primary">VeganScope</span> sur
            votre écran d'accueil&nbsp;?
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={promptInstall}>Oui, installer</Button>
            <Button variant="outline" onClick={() => setDismissed(true)}>
              Plus tard
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
