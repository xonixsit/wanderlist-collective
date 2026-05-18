import { supabase } from "@/integrations/supabase/client";
import { tripImage } from "./trip-images";

export type ItineraryDay = { day: number; title: string; detail: string };

export type Trip = {
  id: string;
  slug: string;
  title: string;
  location: string;
  country: string;
  category: string;
  description: string;
  image: string;
  image_key: string;
  dates: string;
  duration: string;
  price: number;
  spotsLeft: number;
  totalSpots: number;
  status: string;
  trending: boolean;
  highlights: string[];
  itinerary: ItineraryDay[];
};

export const categories = ["All", "Alpine", "Coastal", "Arid", "Celestial"] as const;

type Row = {
  id: string;
  slug: string;
  title: string;
  location: string;
  country: string;
  category: string;
  description: string;
  image_key: string;
  dates: string;
  duration: string;
  price: number;
  spots_left: number;
  total_spots: number;
  status: string;
  trending: boolean;
  highlights: string[];
  itinerary: unknown;
};

function mapRow(r: Row): Trip {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    location: r.location,
    country: r.country,
    category: r.category,
    description: r.description,
    image: tripImage(r.image_key),
    image_key: r.image_key,
    dates: r.dates,
    duration: r.duration,
    price: r.price,
    spotsLeft: r.spots_left,
    totalSpots: r.total_spots,
    status: r.status,
    trending: r.trending,
    highlights: r.highlights ?? [],
    itinerary: (r.itinerary as ItineraryDay[]) ?? [],
  };
}

export async function fetchTrips(): Promise<Trip[]> {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as Row[]).map(mapRow);
}

export async function fetchTripBySlug(slug: string): Promise<Trip | null> {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data as Row) : null;
}

export async function bookTrip(tripId: string, spots = 1): Promise<string> {
  const { data, error } = await supabase.rpc("book_trip", {
    _trip_id: tripId,
    _spots: spots,
  });
  if (error) throw error;
  return data as unknown as string;
}
