import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const PlannerInput = z.object({
  prompt: z.string().min(3).max(2000),
});

export type PlannerDay = { day: number; title: string; detail: string };
export type PlannerResult = { title: string; summary: string; days: PlannerDay[] };

const SYSTEM = `You are Vaga's expert travel planner. Generate a thoughtful, premium itinerary as STRICT JSON with this exact shape:
{"title": string, "summary": string, "days": [{"day": number, "title": string, "detail": string}]}
- Infer trip length from the prompt (default 5 days if unclear, max 14).
- Each day's "detail" should be 1-2 evocative sentences with concrete activities.
- Return ONLY the JSON object, no markdown, no prose.`;

export const generateItinerary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => PlannerInput.parse(input))
  .handler(async ({ data }): Promise<PlannerResult> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI gateway not configured");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: data.prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (res.status === 429) throw new Error("Rate limit reached. Try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in workspace settings.");
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AI gateway error: ${text.slice(0, 200)}`);
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("No content from AI");

    const parsed = JSON.parse(content) as PlannerResult;
    if (!parsed.title || !Array.isArray(parsed.days)) {
      throw new Error("Invalid plan shape");
    }
    return parsed;
  });
