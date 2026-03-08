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
