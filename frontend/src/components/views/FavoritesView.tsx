import { useLanguage } from "../../context/LanguageContext";

export default function FavoritesView() {
  const { t } = useLanguage();

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center py-16">
      <span className="text-4xl mb-3 block">❤️</span>
      <h2 className="text-xl font-bold text-white mb-2">{t.favorites}</h2>
      <p className="text-slate-400 text-sm">Még nincsenek kedvenc eszközeid elmentve a rendszerben.</p>
    </div>
  );
}