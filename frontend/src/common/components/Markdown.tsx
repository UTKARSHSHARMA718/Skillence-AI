"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  children: string;
  className?: string;
}

export const Markdown: React.FC<MarkdownProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={`
        prose
        prose-sm
        max-w-none
        prose-headings:text-gray-900
        prose-p:text-gray-700
        prose-strong:text-gray-900
        prose-code:bg-gray-100
        prose-code:px-1
        prose-code:py-0.5
        prose-code:rounded
        prose-pre:bg-gray-900
        prose-pre:text-white
        prose-pre:rounded-lg
        prose-pre:p-4
        prose-a:text-blue-600
        prose-a:no-underline
        hover:prose-a:underline
        ${className}
      `}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {children}
      </ReactMarkdown>
    </div>
  );
};