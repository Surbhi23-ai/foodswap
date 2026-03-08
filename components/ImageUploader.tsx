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
