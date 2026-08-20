import { useState, useEffect } from "react";
import type { Resource } from "../../@types";
import { useLanguage } from "../../context/LanguageContext";

interface BookingFormProps {
  resources: Resource[];
  loading: boolean;
  onSubmit: (data: { resourceId: string; startTime: string; endTime: string }) => void;
}

export default function BookingForm({ resources, loading, onSubmit }: BookingFormProps) {
  const { t } = useLanguage();
  const todayIso = new Date().toISOString().slice(0, 16);

  const [selectedResource, setSelectedResource] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (!selectedResource && resources.length > 0) {
      setSelectedResource(resources[0].id);
    }
  }, [resources, selectedResource]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ resourceId: selectedResource, startTime, endTime });
    setStartTime("");
    setEndTime("");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white">{t.newBooking}</h3>
        <p className="text-slate-400 text-xs mt-1">{t.selectResourceSub}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {t.selectResourceLabel}
          </label>
          <select
            value={selectedResource}
            onChange={(e) => setSelectedResource(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white"
          >
            {resources.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {t.startTimeLabel}
          </label>
          <input
            type="datetime-local"
            value={startTime}
            min={todayIso}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {t.endTimeLabel}
          </label>
          <input
            type="datetime-local"
            value={endTime}
            min={startTime || todayIso}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
        >
          {loading ? t.bookingButtonLoading : t.bookingButton}
        </button>
      </form>
    </div>
  );
}