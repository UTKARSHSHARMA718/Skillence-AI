"use client";

import { useState } from "react";
import { Report } from "../users.type";
import { Markdown } from "@/common/components/Markdown";

interface Props {
  report: Report | null;
}

const SessionReportDetails: React.FC<Props> = ({ report }) => {
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(
    {},
  );

  if (!report) {
    return (
      <div className="p-6 text-sm text-gray-500 text-center">
        Report not generated yet.
      </div>
    );
  }

  const passCount = report.topicEvaluations.filter((t) => t.passed).length;
  const failCount = report.topicEvaluations.length - passCount;

  const toggleExpand = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Overall Result */}
      <div className="flex items-center justify-between bg-gray-50 border rounded-lg px-4 py-3">
        <div>
          <p className="text-sm text-gray-500">Overall Result</p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            report.overAllResult
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {report.overAllResult ? "PASSED" : "FAILED"}
        </span>
      </div>

      {/* Summary */}
      <div className="flex gap-6 text-sm">
        <div className="bg-green-50 text-green-700 px-3 py-2 rounded-md font-medium">
          Passed Topics: {passCount}
        </div>

        <div className="bg-red-50 text-red-700 px-3 py-2 rounded-md font-medium">
          Failed Topics: {failCount}
        </div>
      </div>

      {/* Overall Feedback */}
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-2">
          Overall Feedback
        </p>

        <div className="bg-gray-50 border rounded-lg p-4 text-sm text-gray-700 leading-relaxed break-words whitespace-pre-line">
          <Markdown>
            {report?.overAllFeedback || "No feedback available."}
          </Markdown>
        </div>
      </div>

      {/* Topic Evaluations */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-800">Topic Evaluations</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.topicEvaluations.map((topic) => {
            const expanded = expandedTopics[topic.topicId];

            return (
              <div
                key={topic.topicId}
                className="border rounded-lg p-4 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  {/* Title */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-medium text-gray-900 truncate max-w-[220px]">
                      {topic.title}
                    </span>

                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        topic.passed
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {topic.passed ? "PASS" : "FAIL"}
                    </span>
                  </div>
                </div>

                {/* Feedback */}
                <div className="mt-3 text-sm text-gray-600 leading-relaxed break-words whitespace-pre-line">
                  <p className={expanded ? "" : "line-clamp-3"}>
                    {topic.topicFeedback}
                  </p>

                  {topic.topicFeedback?.length > 180 && (
                    <button
                      onClick={() => toggleExpand(topic.topicId)}
                      className="text-xs text-blue-600 mt-1 hover:underline"
                    >
                      {expanded ? "Show Less" : "Read More"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SessionReportDetails;
