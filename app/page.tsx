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
