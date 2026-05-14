import sahara from "@/assets/trip-sahara.jpg";
import kyoto from "@/assets/trip-kyoto.jpg";
import patagonia from "@/assets/trip-patagonia.jpg";
import palawan from "@/assets/trip-palawan.jpg";
import norway from "@/assets/trip-norway.jpg";
import bhutan from "@/assets/trip-bhutan.jpg";

export type Trip = {
  slug: string;
  title: string;
  location: string;
  country: string;
  category: string;
  image: string;
  dates: string;
  duration: string;
  price: number;
  spotsLeft: number;
  totalSpots: number;
  status: "open" | "trending" | "sold-out";
  description: string;
  itinerary: { day: number; title: string; detail: string }[];
  highlights: string[];
};

export const trips: Trip[] = [
  {
    slug: "dunes-of-merzouga",
    title: "Dunes of Merzouga",
    location: "Merzouga",
    country: "Morocco",
    category: "Arid",
    image: sahara,
    dates: "Dec 02 — 09",
    duration: "8 days",
    price: 3400,
    spotsLeft: 2,
    totalSpots: 12,
    status: "trending",
    description:
      "A specialized desert immersion through the southern Sahara. Camel caravans, Berber camps, and a private dune bivouac under the stars.",
    itinerary: [
      { day: 1, title: "Arrival in Marrakech", detail: "Riad welcome, opening dinner in the medina." },
      { day: 2, title: "Atlas Crossing", detail: "Drive through the High Atlas; overnight in Aït Benhaddou." },
      { day: 3, title: "Into the Sands", detail: "Reach Merzouga, sunset camel trek to base camp." },
      { day: 4, title: "Erg Chebbi", detail: "Dawn dune walk, nomadic family lunch, astrophotography night." },
      { day: 5, title: "Berber Villages", detail: "Tea ritual, traditional weaving workshop." },
      { day: 6, title: "Dades Gorges", detail: "Gorge hike, riverside ksar overnight." },
      { day: 7, title: "Return to Marrakech", detail: "Souk afternoon, hammam, closing rooftop dinner." },
      { day: 8, title: "Departure", detail: "Private transfers to RAK." },
    ],
    highlights: ["Private desert bivouac", "Berber family dinners", "Astrophotography session", "All transfers included"],
  },
  {
    slug: "the-nakasendo-trail",
    title: "The Nakasendo Trail",
    location: "Nakasendo",
    country: "Japan",
    category: "Alpine",
    image: kyoto,
    dates: "Jan 14 — 25",
    duration: "12 days",
    price: 4800,
    spotsLeft: 4,
    totalSpots: 10,
    status: "open",
    description:
      "Walk the historic post road through cedar forests, lacquered villages, and onsen towns of the Kiso Valley.",
    itinerary: [
      { day: 1, title: "Tokyo Arrival", detail: "Quiet ryokan in Kagurazaka." },
      { day: 2, title: "Magome Start", detail: "Begin the Nakasendo at the Magome stage." },
      { day: 3, title: "Tsumago", detail: "Walk to Tsumago, traditional minshuku." },
      { day: 4, title: "Kiso Valley", detail: "Cedar trails and waterfall lunch." },
      { day: 5, title: "Narai Post Town", detail: "Lacquerware studio visit." },
      { day: 6, title: "Onsen Day", detail: "Private rotenburo and kaiseki dinner." },
      { day: 7, title: "Matsumoto", detail: "Black Crow Castle and contemporary art museum." },
      { day: 8, title: "Kanazawa", detail: "Kenrokuen gardens, gold leaf workshop." },
      { day: 9, title: "Coastal Detour", detail: "Sea of Japan day; fresh sashimi lunch." },
      { day: 10, title: "Kyoto", detail: "Temple morning, tea ceremony in Higashiyama." },
      { day: 11, title: "Arashiyama", detail: "Bamboo grove dawn, river cruise." },
      { day: 12, title: "Departure", detail: "Shinkansen to Osaka KIX." },
    ],
    highlights: ["Historic ryokan stays", "Private tea ceremony", "Lacquerware atelier", "Onsen access throughout"],
  },
  {
    slug: "torres-del-paine-circuit",
    title: "Torres del Paine Circuit",
    location: "Torres del Paine",
    country: "Patagonia",
    category: "Alpine",
    image: patagonia,
    dates: "Feb 08 — 18",
    duration: "10 days",
    price: 5200,
    spotsLeft: 6,
    totalSpots: 14,
    status: "open",
    description:
      "The full O-Circuit through Patagonia's granite cathedrals — supported, with refugio nights and chef-prepared meals.",
    itinerary: [
      { day: 1, title: "Punta Arenas", detail: "Briefing, gear check." },
      { day: 2, title: "Puerto Natales", detail: "Drive in, pre-trek dinner." },
      { day: 3, title: "Day 1 — Seron", detail: "11 km warm-up to Refugio Seron." },
      { day: 4, title: "Day 2 — Dickson", detail: "Open pampas to Dickson glacier views." },
      { day: 5, title: "Day 3 — Los Perros", detail: "Forest climb to alpine lake." },
      { day: 6, title: "Day 4 — Gardner Pass", detail: "Crossing to the Grey Glacier overlook." },
      { day: 7, title: "Day 5 — Paine Grande", detail: "Lakeside ridge walking." },
      { day: 8, title: "Day 6 — French Valley", detail: "Hanging glacier amphitheater." },
      { day: 9, title: "Day 7 — The Towers", detail: "Pre-dawn ascent to base of the towers." },
      { day: 10, title: "Departure", detail: "Return transfer to PUQ." },
    ],
    highlights: ["Full O-Circuit", "Mountain chef in camp", "Glacier kayak option", "Premium refugio bookings"],
  },
  {
    slug: "palawan-archipelago",
    title: "Palawan Archipelago",
    location: "El Nido",
    country: "Philippines",
    category: "Coastal",
    image: palawan,
    dates: "Mar 15 — 22",
    duration: "8 days",
    price: 2950,
    spotsLeft: 8,
    totalSpots: 12,
    status: "open",
    description:
      "Private bangka sailing through Bacuit Bay's limestone karsts. Lagoon swims, beach picnics, and a remote eco-camp finale.",
    itinerary: [
      { day: 1, title: "Manila", detail: "Connecting flight, El Nido arrival." },
      { day: 2, title: "Bacuit Bay", detail: "Big and Small Lagoon paddling." },
      { day: 3, title: "Hidden Beaches", detail: "Snake Island, Helicopter Island lunch." },
      { day: 4, title: "Liveaboard", detail: "Overnight on traditional bangka." },
      { day: 5, title: "Linapacan", detail: "Clearest waters in the world; reef dive." },
      { day: 6, title: "Eco-Camp", detail: "Remote island camp, fire dinner." },
      { day: 7, title: "Coron", detail: "Wreck snorkel, twin lagoons." },
      { day: 8, title: "Departure", detail: "Manila return." },
    ],
    highlights: ["Private bangka charter", "PADI dive options", "Remote eco-camp night", "Local chef onboard"],
  },
  {
    slug: "lofoten-aurora",
    title: "Lofoten Aurora",
    location: "Lofoten",
    country: "Norway",
    category: "Celestial",
    image: norway,
    dates: "Mar 03 — 10",
    duration: "8 days",
    price: 4600,
    spotsLeft: 3,
    totalSpots: 10,
    status: "trending",
    description:
      "A small-group northern lights expedition. Architect-designed cabins, fjord sauna, and nightly aurora chases with a resident astrophotographer.",
    itinerary: [
      { day: 1, title: "Bodø", detail: "Charter to Lofoten." },
      { day: 2, title: "Reine", detail: "Cabin check-in, photography briefing." },
      { day: 3, title: "Aurora Night I", detail: "Mountain ridge shoot." },
      { day: 4, title: "Fjord Day", detail: "RIB cruise, sea eagle safari." },
      { day: 5, title: "Sauna Ritual", detail: "Floating sauna, cold plunge." },
      { day: 6, title: "Aurora Night II", detail: "Beach long-exposure session." },
      { day: 7, title: "Hattvika", detail: "Final dinner, gallery opening." },
      { day: 8, title: "Departure", detail: "Bodø transfer." },
    ],
    highlights: ["Resident astrophotographer", "Floating sauna", "Architect cabins", "All night gear included"],
  },
  {
    slug: "tigers-nest-bhutan",
    title: "Tiger's Nest Pilgrimage",
    location: "Paro",
    country: "Bhutan",
    category: "Alpine",
    image: bhutan,
    dates: "Apr 10 — 20",
    duration: "11 days",
    price: 6400,
    spotsLeft: 5,
    totalSpots: 8,
    status: "open",
    description:
      "A meditative crossing of the Bhutanese highlands. Monastery stays, private audiences with monks, and the Tiger's Nest dawn climb.",
    itinerary: [
      { day: 1, title: "Paro Arrival", detail: "Welcome blessing." },
      { day: 2, title: "Thimphu", detail: "Capital traditions, archery." },
      { day: 3, title: "Punakha Crossing", detail: "Dochula Pass." },
      { day: 4, title: "Dzong Visit", detail: "Punakha Dzong audience." },
      { day: 5, title: "Phobjikha", detail: "Crane valley walking." },
      { day: 6, title: "Bumthang", detail: "Cultural heartland." },
      { day: 7, title: "Monastery Stay", detail: "Overnight with the monks." },
      { day: 8, title: "Return to Paro", detail: "Highway ritual stops." },
      { day: 9, title: "Tiger's Nest", detail: "Dawn climb to Taktsang." },
      { day: 10, title: "Hot Stone Bath", detail: "Closing ritual dinner." },
      { day: 11, title: "Departure", detail: "Paro flight." },
    ],
    highlights: ["Monastery overnight", "Tiger's Nest dawn climb", "Private blessing ceremony", "Hot stone ritual"],
  },
];

export const categories = ["All", "Alpine", "Coastal", "Arid", "Celestial"] as const;

export function getTrip(slug: string): Trip | undefined {
  return trips.find((t) => t.slug === slug);
}
