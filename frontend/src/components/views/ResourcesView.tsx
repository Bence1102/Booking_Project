import { useState, useEffect } from "react";
import type { Resource, Favorite } from "../../@types";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../api/axios";
import ResourceCard from "../resources/ResourceCard";

export default function ResourcesView() {
  const { t } = useLanguage();
  const [resources, setResources] = useState<Resource[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchResources();
    fetchFavorites();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await api.get<Resource[]>("/resources");
      setResources(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await api.get<Favorite[]>("/favorites");
      setFavoriteIds(new Set(res.data.map((f) => f.resourceId)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFavorite = async (resourceId: string, isFavorite: boolean) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isFavorite) {
        next.delete(resourceId);
      } else {
        next.add(resourceId);
      }
      return next;
    });

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${resourceId}`);
      } else {
        await api.post("/favorites", { resourceId });
      }
    } catch (err) {
      console.error(err);
      fetchFavorites();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">{t.resourcesNav}</h2>
        <p className="text-slate-400 text-xs mt-1">{t.resourcesSub}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            isFavorite={favoriteIds.has(resource.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}
