"use client";

import React, { useState } from "react";
import { TopicPagination } from "./TopicPagination";
import { Topic } from "../sessions.types";

type OnboardingFormProps = {
  topics: Topic[];
  onSubmit: (data: { name: string; selectedTopics: string[] }) => void;
  itemsPerPage?: number;
};

export const OnboardingForm: React.FC<OnboardingFormProps> = ({
  topics,
  onSubmit,
  itemsPerPage = 20,
}) => {
  const [name, setName] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) => {
      const updated = new Set(prev);
      if (updated.has(topicId)) {
        updated.delete(topicId);
      } else {
        updated.add(topicId);
      }
      return updated;
    });
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (selectedTopics.size === 0) {
      setError("Please select at least one topic.");
      return;
    }

    setError("");
    onSubmit({
      name,
      selectedTopics: Array.from(selectedTopics),
    });
  };

  return (
    <div className="w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-6">User Onboarding</h2>

      {/* Name Field */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Your Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter your name"
        />
      </div>

      {/* Topics Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-4">
          Select Topics *
          <span className="ml-2 text-gray-500 text-xs">
            ({selectedTopics.size} selected)
          </span>
        </label>

        <TopicPagination
          topics={topics}
          selectedTopics={selectedTopics}
          toggleTopic={toggleTopic}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        onClick={handleSubmit}
        className="w-full rounded-lg bg-black text-white py-3 font-medium hover:opacity-90 transition"
      >
        Submit
      </button>
    </div>
  );
};
