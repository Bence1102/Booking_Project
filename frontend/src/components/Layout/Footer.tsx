import { useLanguage } from "../../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© 2026 BookingApp. Minden jog fenntartva.</p>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <span>{t.systemStatus}:</span>
          <span className="text-emerald-400 font-medium flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t.online}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}