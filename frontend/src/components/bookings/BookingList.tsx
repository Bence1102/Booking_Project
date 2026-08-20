import type { Booking } from "../../@types";
import { useLanguage } from "../../context/LanguageContext";

interface BookingListProps {
  bookings: Booking[];
  deleteLoadingId: string | null;
  onDelete: (id: string) => void;
}

export default function BookingList({ bookings, deleteLoadingId, onDelete }: BookingListProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{t.activeBookingsTitle}</h3>
          <p className="text-slate-400 text-xs mt-1">{t.activeBookingsSub}</p>
        </div>
        <span className="bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-500/20">
          {bookings.length} elem
        </span>
      </div>

      <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
        {bookings.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
            <p className="text-slate-500 text-sm">{t.noBookings}</p>
          </div>
        ) : (
          bookings.map((b) => (
            <div key={b.id} className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="font-bold text-indigo-400">{b.resource?.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    {t.confirmed}
                  </span>
                  <button
                    onClick={() => onDelete(b.id)}
                    disabled={deleteLoadingId === b.id}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition-colors"
                  >
                    {deleteLoadingId === b.id ? "⌛" : "🗑️"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-800/50">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">{t.startLabel}</span>
                  <span className="text-slate-200 font-mono mt-0.5 block">
                    {new Date(b.startTime).toLocaleString("hu-HU", { dateStyle: "short", timeStyle: "short" })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">{t.endLabel}</span>
                  <span className="text-slate-200 font-mono mt-0.5 block">
                    {new Date(b.endTime).toLocaleString("hu-HU", { dateStyle: "short", timeStyle: "short" })}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>{t.bookerLabel} <strong className="text-slate-300">{b.user?.name}</strong></span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}