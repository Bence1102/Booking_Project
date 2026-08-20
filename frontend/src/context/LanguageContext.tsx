import React, { createContext, useContext, useState } from "react";
import type { Language } from "../@types";

const translations = {
  hu: {
    systemStatus: "Rendszer állapot:",
    online: "Online",
    logout: "Kijelentkezés",
    account: "Az én fiókom",
    dashboard: "Főoldal",
    availableResources: "Elérhető Eszközök",
    totalBookings: "Összes Foglalás",
    status: "Rendszer Státusz",
    activeAndRunning: "Aktív & Működőképes",
    newBooking: "Új foglalás indítása",
    selectResourceSub: "Válaszd ki az eszközt és az időintervallumot",
    selectResourceLabel: "Válassz Erőforrást",
    startTimeLabel: "Foglalás Kezdete",
    endTimeLabel: "Foglalás Vége",
    bookingButton: "Foglalás Rögzítése",
    bookingButtonLoading: "Feldolgozás...",
    activeBookingsTitle: "Aktív Foglalások",
    activeBookingsSub: "Valós idejű lista az adatbázisból",
    noBookings: "Még nincs egyetlen foglalás sem.",
    confirmed: "Megerősítve",
    startLabel: "Kezdet",
    endLabel: "Befejezés",
    bookerLabel: "Foglaló:",
    accountSettings: "Felhasználói Fiók Adatok",
    accountSub: "Itt megtekintheted és szerkesztheted a fiókodat",
    nameLabel: "Teljes Név",
    emailLabel: "Email Cím",
    saveChanges: "Változtatások Mentése",
    successSave: "A adatok sikeresen frissültek!",
    favorites: "Kedvencek",
    balance: "Egyenleg",
    reservations: "Foglalások",
    resourcesNav: "Eszközök",
    resourcesSub: "Böngéssz az elérhető eszközök között, jelölj kedvenceket és írj véleményt",
    addFavorite: "Kedvencekhez adás",
    removeFavorite: "Eltávolítás a kedvencekből",
    reviewsTitle: "Vélemények",
    writeReview: "Vélemény írása",
    ratingLabel: "Értékelés",
    commentLabel: "Megjegyzés (opcionális)",
    submitReview: "Vélemény Mentése",
    reviewNeedsBooking: "Csak olyan eszközt értékelhetsz, amit már lefoglaltál.",
    noReviewsYet: "Még nincs értékelés ehhez az eszközhöz.",
    noFavoritesYet: "Még nincsenek kedvenc eszközeid elmentve a rendszerben.",
    noRatingsYet: "Nincs még értékelés",
  },
  en: {
    systemStatus: "System Status:",
    online: "Online",
    logout: "Log Out",
    account: "Account",
    dashboard: "Dashboard",
    availableResources: "Available Resources",
    totalBookings: "Total Bookings",
    status: "Status",
    activeAndRunning: "Active & Running",
    newBooking: "New Booking",
    selectResourceSub: "Choose resource and time interval",
    selectResourceLabel: "Select Resource",
    startTimeLabel: "Start Time",
    endTimeLabel: "End Time",
    bookingButton: "Book Resource",
    bookingButtonLoading: "Processing...",
    activeBookingsTitle: "Active Bookings",
    activeBookingsSub: "Real-time list from database",
    noBookings: "No bookings found.",
    confirmed: "Confirmed",
    startLabel: "Start",
    endLabel: "End",
    bookerLabel: "Booked by:",
    accountSettings: "Account Settings",
    accountSub: "View and edit your profile details",
    nameLabel: "Full Name",
    emailLabel: "Email Address",
    saveChanges: "Save Changes",
    successSave: "Data updated successfully!",
    favorites: "Favorites",
    balance: "Balance",
    reservations: "Reservations",
    resourcesNav: "Resources",
    resourcesSub: "Browse available resources, mark favorites and leave reviews",
    addFavorite: "Add to favorites",
    removeFavorite: "Remove from favorites",
    reviewsTitle: "Reviews",
    writeReview: "Write a review",
    ratingLabel: "Rating",
    commentLabel: "Comment (optional)",
    submitReview: "Save Review",
    reviewNeedsBooking: "You can only review a resource you've already booked.",
    noReviewsYet: "No reviews yet for this resource.",
    noFavoritesYet: "You haven't saved any favorite resources yet.",
    noRatingsYet: "No ratings yet",
  },
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations["hu"];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>("hu");

  const currentLang = (lang in translations ? lang : "hu") as keyof typeof translations;

  const value = {
    lang,
    setLang,
    t: translations[currentLang],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("A useLanguage hook csak a LanguageProvider-en belül használható!");
  }
  return context;
};