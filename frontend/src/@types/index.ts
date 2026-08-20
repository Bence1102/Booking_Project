export interface Resource {
  id: string;
  name: string;
  description: string | null;
}

export interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  resource: Resource;
  user: { id: string; name: string; email: string };
}

export type Language = "hu" | "en" | "de";