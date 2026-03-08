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
          Analyzing <span className="text-gray-800">&quot;{query}&quot;</span>…
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
