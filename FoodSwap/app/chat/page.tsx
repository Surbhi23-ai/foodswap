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
