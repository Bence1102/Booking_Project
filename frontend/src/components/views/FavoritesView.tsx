import { useState, useEffect } from "react";
import type { Favorite } from "../../@types";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../api/axios";
import ResourceCard from "../resources/ResourceCard";

export default function FavoritesView() {
  const { t } = useLanguage();
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await api.get<Favorite[]>("/favorites");
      setFavorites(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFavorite = async (resourceId: string) => {
    setFavorites((prev) => prev.filter((f) => f.resourceId !== resourceId));
    try {
      await api.delete(`/favorites/${resourceId}`);
    } catch (err) {
      console.error(err);
      fetchFavorites();
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center py-16">
        <span className="text-4xl mb-3 block">❤️</span>
        <h2 className="text-xl font-bold text-white mb-2">{t.favorites}</h2>
        <p className="text-slate-400 text-sm">{t.noFavoritesYet}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">{t.favorites}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((f) => (
          <ResourceCard
            key={f.id}
            resource={f.resource}
            isFavorite={true}
            onToggleFavorite={() => handleRemoveFavorite(f.resourceId)}
          />
        ))}
      </div>
    </div>
  );
}
