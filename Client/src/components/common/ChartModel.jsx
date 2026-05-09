export default function ChartModal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center">
      <div className="relative bg-[#020617] rounded-2xl shadow-2xl w-[95vw] h-[90vh] p-5 border border-white/10 overflow-hidden flex flex-col">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-5 z-50 text-2xl text-white hover:text-red-400 hover:scale-110 transition-all duration-150 font-bold leading-none p-2"
          style={{ pointerEvents: 'auto' }}
          aria-label="Close chart"
        >
          ✕
        </button>

        <div className="flex-1 w-full h-full overflow-hidden">
          {children}
        </div>

      </div>
    </div>
  );
}
