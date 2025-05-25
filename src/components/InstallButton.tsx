import React, { useState, useEffect } from "react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export const InstallButton = () => {
  const { isVisible, promptInstall } = useInstallPrompt();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isMobile =
      typeof window !== "undefined" &&
      /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isVisible && !dismissed && isMobile) {
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, dismissed]);

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-32 inset-x-4 mx-auto max-w-xs p-5 rounded-2xl shadow-2xl 
           border bg-white text-gray-900 
           dark:bg-zinc-900 dark:text-white dark:border-zinc-700"
      >
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm">
            Installer{" "}
            <span className="font-semibold text-primary">VeganScope</span> sur
            votre écran d'accueil ?
          </p>
          <button
            onClick={() => setDismissed(true)}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex justify-center gap-3">
          <Button onClick={promptInstall}>Oui, installer</Button>
          <Button variant="outline" onClick={() => setDismissed(true)}>
            Plus tard
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
