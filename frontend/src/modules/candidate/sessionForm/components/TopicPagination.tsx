"use client";

import React, { useMemo, useState } from "react";
import { Topic } from "../sessions.types";

type Props = {
  topics: Topic[];
  selectedTopics: Set<string>;
  toggleTopic: (id: string) => void;
  itemsPerPage: number;
};

export const TopicPagination: React.FC<Props> = ({
  topics,
  selectedTopics,
  toggleTopic,
  itemsPerPage,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(topics.length / itemsPerPage);

  const paginatedTopics = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return topics.slice(start, start + itemsPerPage);
  }, [currentPage, topics, itemsPerPage]);

  return (
    <div>
      {/* Topics List */}
      <div className="grid grid-cols-2 gap-3">
        {paginatedTopics.map((topic) => (
          <label
            key={topic.id}
            className="flex items-center gap-2 p-2 rounded-lg border hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedTopics.has(topic.id)}
              onChange={() => toggleTopic(topic.id)}
              className="h-4 w-4"
            />
            <span className="text-sm">{topic.title}</span>
          </label>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-2 text-sm rounded-lg border disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 text-sm rounded-lg border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};