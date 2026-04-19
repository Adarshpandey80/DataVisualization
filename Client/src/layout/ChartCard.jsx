import { motion } from "framer-motion";
import { usePreferences } from "../context/PreferencesContext";

export default function ChartCard({ title, action, children }) {
  const { settings } = usePreferences();

  return (
    <motion.div
      whileHover={settings.animations ? { scale: 1.01 } : undefined}
      transition={settings.animations ? { type: "spring", stiffness: 120 } : undefined}
      className="relative flex h-full min-h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/75 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
        <h3 className="text-sm font-semibold tracking-wide text-cyan-300">
          {title}
        </h3>
        {action}
      </div>

      <div className="flex-1 min-h-0 p-4">
        {children}
      </div>
    </motion.div>
  );
}
