```
/foodswap-ai
  /app
    /api
      /chat
        route.ts
      /food
        route.ts
      /image
        route.ts
    /chat
      page.tsx
    /results
      page.tsx
    /upload
      page.tsx
    layout.tsx
    page.tsx
  /components
    SearchBar.tsx
    FoodCard.tsx
    ChatBox.tsx
    ImageUploader.tsx
    Navbar.tsx
  /lib
    openai.ts
    supabase.ts
  /types
    food.ts
    user.ts
  /styles
    globals.css
  package.json
  tailwind.config.ts
  tsconfig.json
  next.config.js
  postcss.config.js
  .env.local.example
  README.md
```

---

**`package.json`**
```json
{
  "name": "foodswap-ai",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.43.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.379.0",
    "next": "14.2.3",
    "openai": "^4.47.1",
    "react": "^18",
    "react-dom": "^18",
    "react-dropzone": "^14.2.3",
    "react-hot-toast": "^2.4.1",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.2.3",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

---

**`next.config.js`**
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

module.exports = nextConfig;
```

---

**`tailwind.config.ts`**
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

**`tsconfig.json`**
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

**`postcss.config.js`**
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

**`.env.local.example`**
```
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

**`README.md`**
```md
# FoodSwap AI

AI-powered food nutrition analysis and healthy alternative finder.

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- OpenAI API
- Supabase

## Setup

1. Clone the repository
2. Copy env file: `cp .env.local.example .env.local`
3. Fill in your API keys in `.env.local`
4. Install dependencies: `npm install`
5. Run development server: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000)

## Features
- Food nutrition search powered by OpenAI
- AI nutrition chatbot
- Food image recognition
- Healthier food alternatives

## Deploy
Push to GitHub and import into Vercel. Add environment variables in Vercel dashboard.
```

---

**`types/food.ts`**
```ts
export type HealthLabel = "Safe" | "Moderate" | "Avoid";

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

export interface FoodAlternative {
  name: string;
  reason: string;
  healthLabel: HealthLabel;
  nutrition: NutritionInfo;
}

export interface FoodResult {
  name: string;
  healthLabel: HealthLabel;
  explanation: string;
  nutrition: NutritionInfo;
  alternatives: FoodAlternative[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}
```

---

**`types/user.ts`**
```ts
export type DietPreference =
  | "vegetarian"
  | "vegan"
  | "eggetarian"
  | "non-vegetarian"
  | "any";

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  diet_preference: DietPreference;
  allergies: string[];
  location: string | null;
  created_at: string;
  updated_at: string;
}
```

---

**`lib/openai.ts`**
```ts
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "Missing OPENAI_API_KEY. Add it to your .env.local file."
  );
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const NUTRITION_SYSTEM_PROMPT = `
You are FoodSwap AI, an expert nutrition assistant.
Your responsibilities:
- Provide accurate nutrition data per 100g for any food item.
- Classify foods as Safe, Moderate, or Avoid based on health impact.
- Suggest 3 realistic, healthier alternative foods with reasons.
- Answer diet and nutrition questions clearly and concisely.
- Always return valid JSON when asked for structured data.
Do not include markdown in JSON responses.
`.trim();

export async function analyzeFoodByName(foodName: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: NUTRITION_SYSTEM_PROMPT },
      {
        role: "user",
        content: `
Analyze the food item: "${foodName}".

Return a JSON object with this exact shape:
{
  "name": string,
  "healthLabel": "Safe" | "Moderate" | "Avoid",
  "explanation": string,
  "nutrition": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number,
    "sugar": number
  },
  "alternatives": [
    {
      "name": string,
      "reason": string,
      "healthLabel": "Safe" | "Moderate" | "Avoid",
      "nutrition": {
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number
      }
    }
  ]
}
        `.trim(),
      },
    ],
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error("Empty response from OpenAI.");
  return JSON.parse(content);
}

export async function analyzeFoodImage(base64Image: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: NUTRITION_SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `
Identify the food in this image and analyze it.

Return a JSON object with this exact shape:
{
  "name": string,
  "healthLabel": "Safe" | "Moderate" | "Avoid",
  "explanation": string,
  "nutrition": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number,
    "sugar": number
  },
  "alternatives": [
    {
      "name": string,
      "reason": string,
      "healthLabel": "Safe" | "Moderate" | "Avoid",
      "nutrition": {
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number
      }
    }
  ]
}
            `.trim(),
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
              detail: "low",
            },
          },
        ],
      },
    ],
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error("Empty response from OpenAI.");
  return JSON.parse(content);
}

export async function chatWithNutritionAI(
  message: string,
  history: Array<{ role: "user" | "assistant"; content: string }>
) {
  const recentHistory = history.slice(-10);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 700,
    temperature: 0.7,
    messages: [
      { role: "system", content: NUTRITION_SYSTEM_PROMPT },
      ...recentHistory,
      { role: "user", content: message },
    ],
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error("Empty response from OpenAI.");
  return content;
}
```

---

**`lib/supabase.ts`**
```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Check your .env.local file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const createServerSupabaseClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable.");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// ── Example DB helpers ──────────────────────────────────────────────────────

export async function logFoodSearch(foodName: string, userId?: string) {
  const { error } = await supabase.from("food_searches").insert({
    food_name: foodName,
    user_id: userId ?? null,
    searched_at: new Date().toISOString(),
  });
  if (error) console.error("[Supabase] logFoodSearch error:", error.message);
}

export async function getFoodFromCache(foodName: string) {
  const { data, error } = await supabase
    .from("food_cache")
    .select("*")
    .ilike("name", foodName.trim())
    .maybeSingle();

  if (error) console.error("[Supabase] getFoodFromCache error:", error.message);
  return data;
}

export async function saveFoodToCache(foodData: Record<string, unknown>) {
  const { error } = await supabase.from("food_cache").upsert(foodData, {
    onConflict: "name",
  });
  if (error) console.error("[Supabase] saveFoodToCache error:", error.message);
}
```

---

**`app/api/food/route.ts`**
```ts
import { NextRequest, NextResponse } from "next/server";
import { analyzeFoodByName } from "@/lib/openai";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required.", success: false },
      { status: 400 }
    );
  }

  try {
    const result = await analyzeFoodByName(query);
    return NextResponse.json({ result, success: true });
  } catch (err: unknown) {
    console.error("[/api/food GET]", err);
    const message =
      err instanceof Error ? err.message : "Food analysis failed.";
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}
```

---

**`app/api/chat/route.ts`**
```ts
import { NextRequest, NextResponse } from "next/server";
import { chatWithNutritionAI } from "@/lib/openai";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, conversation_history = [] } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Field 'message' is required.", success: false },
        { status: 400 }
      );
    }

    const reply = await chatWithNutritionAI(
      message.trim(),
      conversation_history
    );

    return NextResponse.json({ reply, success: true });
  } catch (err: unknown) {
    console.error("[/api/chat POST]", err);
    const message = err instanceof Error ? err.message : "Chat request failed.";
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}
```

---

**`app/api/image/route.ts`**
```ts
import { NextRequest, NextResponse } from "next/server";
import { analyzeFoodImage } from "@/lib/openai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image } = body;

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "Field 'image' (base64 string) is required.", success: false },
        { status: 400 }
      );
    }

    // Strip data URI prefix if present
    const base64 = image.includes(",") ? image.split(",")[1] : image;

    const result = await analyzeFoodImage(base64);
    return NextResponse.json({ result, success: true });
  } catch (err: unknown) {
    console.error("[/api/image POST]", err);
    const message =
      err instanceof Error ? err.message : "Image analysis failed.";
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}
```

---

**`styles/globals.css`**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap");

@layer base {
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    @apply bg-gray-50 text-gray-900 font-sans;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-bold tracking-tight;
  }
}

@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-brand-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-secondary {
    @apply inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .card {
    @apply rounded-2xl bg-white border border-gray-100 shadow-sm p-6 transition-all duration-200;
  }

  .input-field {
    @apply w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100;
  }

  .badge-safe {
    @apply inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700;
  }

  .badge-moderate {
    @apply inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700;
  }

  .badge-avoid {
    @apply inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700;
  }

  .nutrition-pill {
    @apply flex flex-col items-center rounded-xl bg-gray-50 px-4 py-3 text-center;
  }
}

@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

---

**`app/layout.tsx`**
```tsx
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "FoodSwap AI — Find Healthier Food Alternatives",
    template: "%s | FoodSwap AI",
  },
  description:
    "Analyze any food, get instant nutrition facts, and discover healthier alternatives powered by AI.",
  keywords: [
    "food nutrition",
    "healthy eating",
    "food alternatives",
    "AI nutrition",
    "diet",
    "calories",
  ],
  authors: [{ name: "FoodSwap AI" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "14px",
              background: "#ffffff",
              color: "#111827",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              fontSize: "14px",
              fontWeight: 500,
            },
          }}
        />
      </body>
    </html>
  );
}
```

---

**`app/page.tsx`**
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Leaf,
  MessageCircle,
  Camera,
  Zap,
  ChevronRight,
  Star,
  TrendingUp,
} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import toast from "react-hot-toast";

const QUICK_SEARCHES = [
  "White bread",
  "French fries",
  "Instant noodles",
  "Coca-Cola",
  "Greek yogurt",
  "Brown rice",
  "Pizza",
  "Oats",
];

const FEATURES = [
  {
    icon: <Zap className="h-5 w-5 text-brand-600" />,
    title: "Instant Analysis",
    description: "Get calories, protein, carbs, and fat data in seconds.",
  },
  {
    icon: <Leaf className="h-5 w-5 text-brand-600" />,
    title: "Healthier Swaps",
    description: "Discover smarter alternatives for any food you love.",
  },
  {
    icon: <MessageCircle className="h-5 w-5 text-brand-600" />,
    title: "AI Chat",
    description: "Ask a nutrition question and get expert AI answers.",
  },
  {
    icon: <Camera className="h-5 w-5 text-brand-600" />,
    title: "Image Recognition",
    description: "Upload a food photo and let AI identify and analyze it.",
  },
];

const STATS = [
  { value: "10k+", label: "Foods Analyzed" },
  { value: "98%", label: "Accuracy Rate" },
  { value: "3x", label: "Faster Than Manual" },
];

export default function HomePage() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      toast.error("Please enter a food item.");
      return;
    }
    setIsNavigating(true);
    router.push(`/results?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-emerald-50">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-20 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700">
          <Star className="h-3.5 w-3.5 fill-brand-500 text-brand-500" />
          AI-Powered Nutrition Intelligence
        </div>

        <h1 className="mb-5 text-5xl font-extrabold leading-tight text-gray-900 sm:text-6xl lg:text-7xl">
          Eat Smarter with{" "}
          <span className="text-brand-600">FoodSwap AI</span>
        </h1>

        <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-gray-500">
          Search any food item to get instant nutrition facts and discover
          healthier alternatives — all powered by advanced AI.
        </p>

        {/* Search */}
        <div className="mx-auto max-w-2xl">
          <SearchBar onSearch={handleSearch} isLoading={isNavigating} />
        </div>

        {/* Quick Search Chips */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <span className="self-center text-sm text-gray-400">Try:</span>
          {QUICK_SEARCHES.map((item) => (
            <button
              key={item}
              onClick={() => handleSearch(item)}
              disabled={isNavigating}
              className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-50"
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="grid grid-cols-3 gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="card text-center">
              <p className="text-3xl font-extrabold text-brand-600">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Everything you need to eat better
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card hover:shadow-md">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
                {f.icon}
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">{f.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Cards */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Chat CTA */}
          <div className="rounded-3xl bg-brand-600 p-8 text-white">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2 text-2xl font-bold">AI Nutrition Chat</h3>
            <p className="mb-6 text-brand-100">
              Ask anything — healthy dinners, low-calorie snacks, or high-protein
              meals. Get instant expert answers.
            </p>
            <button
              onClick={() => router.push("/chat")}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              Start chatting
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Image Upload CTA */}
          <div className="rounded-3xl bg-gray-900 p-8 text-white">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-700">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2 text-2xl font-bold">Image Recognition</h3>
            <p className="mb-6 text-gray-400">
              Upload a photo of any food. AI will identify it and give you full
              nutrition analysis instantly.
            </p>
            <button
              onClick={() => router.push("/upload")}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
            >
              Upload a photo
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center">
        <p className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <TrendingUp className="h-4 w-4 text-brand-500" />
          FoodSwap AI &mdash; Built with Next.js &amp; OpenAI &mdash;{" "}
          {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
```

---

**`app/results/page.tsx`**
```tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import FoodCard from "@/components/FoodCard";
import SearchBar from "@/components/SearchBar";
import toast from "react-hot-toast";
import type { FoodResult } from "@/types/food";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [result, setResult] = useState<FoodResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setError("No food query provided.");
      setLoading(false);
      return;
    }

    const fetchResult = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/food?q=${encodeURIComponent(query.trim())}`
        );
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to fetch results.");
        }
        setResult(json.result);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Something went wrong.";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [query]);

  const handleNewSearch = (newQuery: string) => {
    router.push(`/results?q=${encodeURIComponent(newQuery.trim())}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-brand-600" />
        <p className="font-medium text-gray-500">
          Analyzing <span className="text-gray-800">"{query}"</span>…
        </p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle className="h-14 w-14 text-red-400" />
        <h2 className="text-xl font-semibold text-gray-800">
          {error || "No results found."}
        </h2>
        <button onClick={() => router.push("/")} className="btn-primary mt-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Back + New Search */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>
        <div className="w-full sm:max-w-sm">
          <SearchBar
            onSearch={handleNewSearch}
            placeholder="Search another food…"
            compact
          />
        </div>
      </div>

      {/* Main Result */}
      <FoodCard food={result} />

      {/* Alternatives */}
      {result.alternatives && result.alternatives.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Healthier Alternatives
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.alternatives.map((alt, idx) => (
              <FoodCard
                key={idx}
                food={alt}
                isAlternative
                onSearch={handleNewSearch}
              />
            ))}
          </div>
        </section>
      )}

      {/* Ask AI CTA */}
      <div className="mt-12 rounded-2xl bg-brand-50 border border-brand-100 p-6 text-center">
        <p className="mb-3 font-medium text-brand-800">
          Want to know more about{" "}
          <strong>{result.name}</strong>?
        </p>
        <button
          onClick={() =>
            router.push(
              `/chat?q=${encodeURIComponent(`Tell me more about ${result.name}`)}`
            )
          }
          className="btn-primary"
        >
          Ask AI Nutrition Chat
        </button>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-brand-600" />
          </div>
        }
      >
        <ResultsContent />
      </Suspense>
    </div>
  );
}
```

---

**`app/chat/page.tsx`**
```tsx
import type { Metadata } from "next";
import ChatBox from "@/components/ChatBox";

export const metadata: Metadata = {
  title: "AI Nutrition Chat",
  description: "Ask our AI nutrition assistant anything about food and health.",
};

export default function ChatPage() {
  return (
    <div className="flex h-[calc(100vh-65px)] flex-col bg-gray-50">
      <div className="border-b border-gray-100 bg-white px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-xl font-bold text-gray-900">
            AI Nutrition Assistant
          </h1>
          <p className="text-sm text-gray-500">
            Ask anything about food, nutrition, diets, or healthy alternatives.
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatBox />
      </div>
    </div>
  );
}
```

---

**`app/upload/page.tsx`**
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import FoodCard from "@/components/FoodCard";
import toast from "react-hot-toast";
import type { FoodResult } from "@/types/food";

export default function UploadPage() {
  const router = useRouter();
  const [result, setResult] = useState<FoodResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true);
    setResult(null);
    const toastId = toast.loading("Analyzing your food image…");

    try {
      const base64 = await fileToBase64(file);

      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Image analysis failed.");
      }

      toast.success(`Identified: ${json.result.name}`, { id: toastId });
      setResult(json.result);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message, { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <button
          onClick={() => router.push("/")}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Food Image Recognition
            </h1>
          </div>
          <p className="text-gray-500">
            Upload a photo of any food. AI will identify it and return full
            nutrition analysis.
          </p>
        </div>

        <div className="card mb-8">
          <ImageUploader
            onUpload={handleImageUpload}
            isLoading={isAnalyzing}
          />
        </div>

        {result && (
          <>
            <FoodCard food={result} />

            {result.alternatives && result.alternatives.length > 0 && (
              <section className="mt-10">
                <h2 className="mb-5 text-xl font-bold text-gray-900">
                  Healthier Alternatives
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {result.alternatives.map((alt, idx) => (
                    <FoodCard
                      key={idx}
                      food={alt}
                      isAlternative
                      onSearch={(name) =>
                        router.push(
                          `/results?q=${encodeURIComponent(name)}`
                        )
                      }
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") resolve(result);
      else reject(new Error("Failed to read file."));
    };
    reader.onerror = () => reject(new Error("File read error."));
    reader.readAsDataURL(file);
  });
}
```

---

**`components/Navbar.tsx`**
```tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { Leaf, MessageCircle, Camera, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

const NAV_LINKS = [
  { label: "Search", href: "/", icon: <Search className="h-4 w-4" /> },
  { label: "AI Chat", href: "/chat", icon: <MessageCircle className="h-4 w-4" /> },
  { label: "Upload Photo", href: "/upload", icon: <Camera className="h-4 w-4" /> },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2.5 focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">FoodSwap AI</span>
        </button>

        {/* Desktop Links */}
        <div className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => router.push(link.href)}
              className={clsx(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
                pathname === link.href
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 sm:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 sm:hidden">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => {
                router.push(link.href);
                setMobileOpen(false);
              }}
              className={clsx(
                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                pathname === link.href
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
```

---

**`components/SearchBar.tsx`**
```tsx
"use client";

import { useState, useRef } from "react";
import { Search, Mic, MicOff, Loader2 } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  compact?: boolean;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search a food item… e.g. white bread, french fries",
  isLoading = false,
  compact = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  const startVoice = () => {
    const SR =
      (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition })
        .webkitSpeechRecognition || window.SpeechRecognition;

    if (!SR) {
      toast.error("Voice search not supported in this browser.");
      return;
    }

    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onerror = () => {
      setIsListening(false);
      toast.error("Voice recognition failed. Try again.");
    };
    rec.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      setQuery(text);
      onSearch(text);
    };

    recognitionRef.current = rec;
    rec.start();
    toast("Listening… speak a food item.", { icon: "🎤" });
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={clsx("flex items-center gap-2", compact ? "gap-1.5" : "gap-2")}>
        {/* Text Input */}
        <div className="relative flex-1">
          <Search
            className={clsx(
              "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400",
              compact ? "h-4 w-4" : "h-5 w-5"
            )}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className={clsx(
              "input-field",
              compact ? "py-2.5 pl-10 text-sm" : "py-4 pl-12 text-base"
            )}
          />
        </div>

        {/* Voice */}
        {!compact && (
          <button
            type="button"
            onClick={isListening ? stopVoice : startVoice}
            disabled={isLoading}
            title={isListening ? "Stop listening" : "Voice search"}
            className={clsx(
              "flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl transition-all",
              isListening
                ? "animate-pulse bg-red-500 text-white shadow-lg"
                : "btn-secondary h-14 w-14 p-0"
            )}
          >
            {isListening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </button>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className={clsx(
            "btn-primary flex-shrink-0",
            compact ? "h-10 px-4 text-sm" : "h-14 px-6"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Search className={compact ? "h-4 w-4" : "h-5 w-5"} />
              {!compact && <span className="hidden sm:inline">Search</span>}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
```

---

**`components/FoodCard.tsx`**
```tsx
"use client";

import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Flame,
  Beef,
  Wheat,
  Droplets,
  ArrowRight,
  Sprout,
} from "lucide-react";
import clsx from "clsx";
import type { FoodResult, FoodAlternative, HealthLabel } from "@/types/food";

interface FoodCardProps {
  food: FoodResult | FoodAlternative;
  isAlternative?: boolean;
  onSearch?: (name: string) => void;
}

const HEALTH_CONFIG: Record<
  HealthLabel,
  {
    badgeClass: string;
    icon: React.ReactNode;
    barColor: string;
    borderColor: string;
  }
> = {
  Safe: {
    badgeClass: "badge-safe",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    barColor: "bg-green-500",
    borderColor: "border-l-green-500",
  },
  Moderate: {
    badgeClass: "badge-moderate",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    barColor: "bg-amber-500",
    borderColor: "border-l-amber-500",
  },
  Avoid: {
    badgeClass: "badge-avoid",
    icon: <XCircle className="h-3.5 w-3.5" />,
    barColor: "bg-red-500",
    borderColor: "border-l-red-500",
  },
};

function NutritionPill({
  icon,
  label,
  value,
  unit = "g",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit?: string;
}) {
  return (
    <div className="nutrition-pill">
      <div className="mb-1 text-gray-400">{icon}</div>
      <span className="text-base font-bold text-gray-900">
        {value}
        <span className="text-xs font-normal text-gray-400 ml-0.5">{unit}</span>
      </span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

export default function FoodCard({
  food,
  isAlternative = false,
  onSearch,
}: FoodCardProps) {
  const config = HEALTH_CONFIG[food.healthLabel];
  const explanation = "explanation" in food ? food.explanation : undefined;
  const reason = "reason" in food ? food.reason : undefined;

  const handleClick = () => {
    if (isAlternative && onSearch) onSearch(food.name);
  };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "card border-l-4",
        config.borderColor,
        isAlternative &&
          "cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50">
            <Sprout className="h-5 w-5 text-brand-600" />
          </div>
          <div className="min-w-0">
            <h2
              className={clsx(
                "truncate font-bold text-gray-900",
                isAlternative ? "text-base" : "text-2xl"
              )}
            >
              {food.name}
            </h2>
            {reason && (
              <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                {reason}
              </p>
            )}
          </div>
        </div>
        <span className={clsx("flex-shrink-0", config.badgeClass)}>
          {config.icon}
          {food.healthLabel}
        </span>
      </div>

      {/* Explanation */}
      {explanation && (
        <p className="mb-5 text-sm leading-relaxed text-gray-600">
          {explanation}
        </p>
      )}

      {/* Nutrition */}
      <div
        className={clsx(
          "grid gap-3",
          isAlternative ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"
        )}
      >
        <NutritionPill
          icon={<Flame className="h-4 w-4" />}
          label="Calories"
          value={food.nutrition.calories}
          unit="kcal"
        />
        <NutritionPill
          icon={<Beef className="h-4 w-4" />}
          label="Protein"
          value={food.nutrition.protein}
        />
        <NutritionPill
          icon={<Wheat className="h-4 w-4" />}
          label="Carbs"
          value={food.nutrition.carbs}
        />
        <NutritionPill
          icon={<Droplets className="h-4 w-4" />}
          label="Fat"
          value={food.nutrition.fat}
        />
      </div>

      {/* Extra nutrition (non-alternative) */}
      {!isAlternative &&
        (food.nutrition.fiber !== undefined ||
          food.nutrition.sugar !== undefined) && (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {food.nutrition.fiber !== undefined && (
              <NutritionPill
                icon={<Sprout className="h-4 w-4" />}
                label="Fiber"
                value={food.nutrition.fiber}
              />
            )}
            {food.nutrition.sugar !== undefined && (
              <NutritionPill
                icon={<Droplets className="h-4 w-4" />}
                label="Sugar"
                value={food.nutrition.sugar}
              />
            )}
          </div>
        )}

      {/* Alternative CTA */}
      {isAlternative && (
        <div className="mt-4 flex items-center justify-end gap-1 text-xs font-semibold text-brand-600">
          View full analysis
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      )}
    </div>
  );
}
```

---

**`components/ChatBox.tsx`**
```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Loader2,
  Bot,
  User,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";
import type { ChatMessage } from "@/types/food";

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm your AI nutrition assistant 🥗\n\nAsk me anything — healthy meal ideas, calorie info, food comparisons, or diet tips. I'm here to help you eat better.",
  timestamp: new Date(),
};

const SUGGESTIONS = [
  "Suggest a healthy dinner",
  "Low calorie snacks under 100 kcal",
  "High protein vegetarian foods",
  "Is brown rice better than white rice?",
  "Best foods for weight loss",
  "Why is maida unhealthy?",
];

function Bubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div
      className={clsx(
        "flex items-end gap-2.5",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={clsx(
          "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl",
          isUser ? "bg-brand-600" : "bg-gray-100"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-gray-600" />
        )}
      </div>
      <div
        className={clsx(
          "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
          isUser
            ? "rounded-br-md bg-brand-600 text-white"
            : "rounded-bl-md border border-gray-100 bg-white text-gray-800"
        )}
      >
        {message.content.split("\n").map((line, i) => (
          <p key={i} className={i > 0 && line ? "mt-1.5" : ""}>
            {line}
          </p>
        ))}
        <p
          className={clsx(
            "mt-2 text-[11px]",
            isUser ? "text-brand-200" : "text-gray-400"
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          conversation_history: history,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Chat request failed.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: json.reply,
          timestamp: new Date(),
        },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(msg);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleReset = () => {
    setMessages([WELCOME]);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
        <div className="mx-auto max-w-3xl space-y-5">
          {messages.map((msg) => (
            <Bubble key={msg.id} message={msg} />
          ))}

          {loading && (
            <div className="flex items-end gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gray-100">
                <Bot className="h-4 w-4 text-gray-600" />
              </div>
              <div className="rounded-2xl rounded-bl-md border border-gray-100 bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking…
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="border-t border-gray-100 bg-white px-4 py-3">
          <div className="mx-auto max-w-3xl">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-400">
              <Sparkles className="h-3.5 w-3.5" />
              Try asking
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs font-medium text-gray-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="sticky bottom-0 border-t border-gray-100 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <button
            onClick={handleReset}
            title="Clear chat"
            className="mb-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about nutrition, healthy swaps, diets…"
            rows={1}
            className="input-field flex-1 resize-none py-3 leading-relaxed"
            style={{ maxHeight: "120px" }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="btn-primary h-11 w-11 flex-shrink-0 rounded-xl p-0"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-gray-400">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
```

---

**`components/ImageUploader.tsx`**
```tsx
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, ImageIcon, X, Loader2, Camera } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

export default function ImageUploader({
  onUpload,
  isLoading = false,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((accepted: File[], rejected: unknown[]) => {
    if ((rejected as File[]).length > 0) {
      toast.error("File must be an image under 10MB.");
      return;
    }
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: isLoading,
  });

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setFile(null);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={clsx(
          "relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200",
          isDragActive
            ? "scale-[1.01] border-brand-500 bg-brand-50"
            : "border-gray-200 bg-gray-50 hover:border-brand-400 hover:bg-brand-50",
          isLoading && "cursor-not-allowed opacity-60",
          preview && "border-brand-400 bg-brand-50"
        )}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Food preview"
              className="max-h-52 max-w-full rounded-xl object-contain shadow-md"
            />
            {!isLoading && (
              <button
                onClick={handleClear}
                className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100">
              <Camera className="h-8 w-8 text-brand-600" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-700">
                {isDragActive
                  ? "Drop your photo here"
                  : "Upload a food photo"}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Drag & drop or click to browse · JPG, PNG, WebP up to 10MB
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm">
              <Upload className="h-4 w-4" />
              Browse Files
            </div>
          </div>
        )}
      </div>

      {/* Analyze Button */}
      {file && !isLoading && (
        <button
          onClick={() => onUpload(file)}
          className="btn-primary w-full py-4 text-base"
        >
          <ImageIcon className="h-5 w-5" />
          Analyze This Food
        </button>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-brand-100 bg-brand-50 p-4">
          <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
          <span className="text-sm font-medium text-brand-700">
            AI is identifying your food…
          </span>
        </div>
      )}
    </div>
  );
}
```