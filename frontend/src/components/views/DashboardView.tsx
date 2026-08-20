import { useState, useEffect } from "react";
import type { Resource, Booking } from "../../@types";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../api/axios";
import BookingForm from "../bookings/BookingForm";
import BookingList from "../bookings/BookingList";

export default function DashboardView() {
  const { t } = useLanguage();

  const [resources, setResources] = useState<Resource[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
    fetchBookings();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await api.get("/resources");
      setResources(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBooking = async (data: { resourceId: string; startTime: string; endTime: string }) => {
    setError("");
    setSuccess("");

    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (start < new Date()) {
      setError("Nem lehet múltbeli időpontra foglalást rögzíteni!");
      return;
    }

    if (start >= end) {
      setError("A kezdési időpontnak korábban kell lennie, mint a befejezés!");
      return;
    }

    setLoading(true);
    try {
      await api.post("/bookings", {
        resourceId: data.resourceId,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });
      setSuccess("Foglalás sikeresen rögzítve!");
      fetchBookings();
    } catch (err: any) {
      setError(err.response?.data?.error || "Sikertelen foglalás!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    setError("");
    setSuccess("");
    setDeleteLoadingId(id);

    try {
      await api.delete(`/bookings/${id}`);
      setSuccess("Foglalás sikeresen törölve!");
      fetchBookings();
    } catch (err: any) {
      setError(err.response?.data?.error || "A foglalás törlése sikertelen!");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center space-x-3">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center space-x-3">
          <span>✅</span>
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{t.availableResources}</p>
          <p className="text-3xl font-extrabold text-white mt-2">{resources.length} db</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{t.totalBookings}</p>
          <p className="text-3xl font-extrabold text-indigo-400 mt-2">{bookings.length} db</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{t.status}</p>
          <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {t.activeAndRunning}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <BookingForm resources={resources} loading={loading} onSubmit={handleBooking} />
        </div>
        <div className="lg:col-span-7">
          <BookingList bookings={bookings} deleteLoadingId={deleteLoadingId} onDelete={handleDeleteBooking} />
        </div>
      </div>
    </div>
  );
}