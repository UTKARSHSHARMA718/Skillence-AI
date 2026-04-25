"use client";

import clsx from "clsx";
import { useEffect, useRef } from "react";

type TranscriptItem = {
  role: "user" | "bot";
  text?: string;
  message?: string;
};

interface TranscriptProps {
  transcripts: TranscriptItem[];
  className?: string;
}

const Transcript: React.FC<TranscriptProps> = ({ transcripts, className }) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to the bottom when the transcripts change
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [transcripts]); // Runs whenever the 'transcripts' prop changes

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col flex-1 min-h-0 gap-4">
      <div
        ref={scrollContainerRef}
        className={`${className} flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto`}
      >
        {transcripts.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">
            No transcript available!
          </p>
        )}

        {transcripts.map((item, index) => {
          const isUser = item.role === "user";

          return (
            <div
              key={index}
              className={clsx(
                "flex w-full",
                isUser ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={clsx(
                  "max-w-[75%] px-4 py-2 rounded-lg text-sm",
                  isUser
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-800",
                )}
              >
                <p className="text-xs font-semibold mb-1 opacity-70">
                  {isUser ? "You" : "Reviewer"}
                </p>

                <p className="leading-relaxed">{item?.text || item?.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Transcript;
