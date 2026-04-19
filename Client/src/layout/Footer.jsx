const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-slate-950/60 px-4 py-3 backdrop-blur-xl md:px-6">
      <div className="flex flex-col items-center justify-between gap-2 text-sm text-slate-400 md:flex-row">

        <div>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-slate-100">
            Blackcoffer Analytics
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="transition hover:text-cyan-300">
            Privacy
          </a>
          <a href="#" className="transition hover:text-cyan-300">
            Terms
          </a>
          <a href="#" className="transition hover:text-cyan-300">
            Support
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
