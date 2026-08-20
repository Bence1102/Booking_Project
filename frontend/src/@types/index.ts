export interface Resource {
  id: string;
  name: string;
  description: string | null;
  avgRating?: number | null;
  reviewCount?: number;
}

export interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  resource: Resource;
  user: { id: string; name: string; email: string };
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { id: string; name: string };
}

export interface Favorite {
  id: string;
  resourceId: string;
  resource: Resource;
}

export type Language = "hu" | "en" | "de";
