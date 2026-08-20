import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export default function Navbar({ currentView, setCurrentView }: NavbarProps) {
  const { userName, logout } = useAuth();
  const { t, lang, setLang } = useLanguage();

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div 
            onClick={() => setCurrentView("dashboard")}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
              B
            </div>
            <span className="font-extrabold text-white tracking-wide">BookingApp</span>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setCurrentView("dashboard")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentView === "dashboard"
                  ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {t.dashboard}
            </button>
            <button
              onClick={() => setCurrentView("favorites")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentView === "favorites"
                  ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {t.favorites}
            </button>
            <button
              onClick={() => setCurrentView("account")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentView === "account"
                  ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {t.account}
            </button>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {/* Nyelvválasztó */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setLang("hu")}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${lang === "hu" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
            >
              HU
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${lang === "en" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
            >
              EN
            </button>
          </div>

          <div className="h-6 w-[1px] bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-medium text-slate-300 hidden sm:inline">{userName}</span>
            <button
              onClick={logout}
              className="bg-slate-800 hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all border border-slate-700/50 hover:border-rose-500/20"
            >
              {t.logout}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}