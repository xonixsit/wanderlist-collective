import sahara from "@/assets/trip-sahara.jpg";
import kyoto from "@/assets/trip-kyoto.jpg";
import patagonia from "@/assets/trip-patagonia.jpg";
import palawan from "@/assets/trip-palawan.jpg";
import norway from "@/assets/trip-norway.jpg";
import bhutan from "@/assets/trip-bhutan.jpg";
import hero from "@/assets/hero-iceland.jpg";

export const tripImages: Record<string, string> = {
  sahara,
  kyoto,
  patagonia,
  palawan,
  norway,
  bhutan,
  hero,
};

export function tripImage(key: string | null | undefined): string {
  if (!key) return hero;
  return tripImages[key] ?? hero;
}
