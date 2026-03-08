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
