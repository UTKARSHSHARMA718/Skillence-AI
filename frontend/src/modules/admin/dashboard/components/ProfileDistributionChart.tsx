"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

type Data = {
  profile: string;
  count: number;
};

const COLORS = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

interface Props {
  data?: Data[];
}

export const ProfileDistributionChart: React.FC<Props> = ({ data }) => {
  const chartData = data && data.length > 0 ? data : [];

  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  const formatTooltip: TooltipProps<ValueType, NameType>["formatter"] = (
    value,
    name,
  ) => {
    const numericValue = typeof value === "number" ? value : Number(value ?? 0);

    const percent =
      total && numericValue ? ((numericValue / total) * 100).toFixed(1) : "0.0";

    return [`${numericValue} (${percent}%)`, name];
  };

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-gray-500">
        No profile data available
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Title */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-800">
          Candidate Profile Distribution
        </h3>

        <p className="text-xs text-gray-500">
          Breakdown of candidates by selected profile.
        </p>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="profile"
              outerRadius={90}
              innerRadius={50}
              paddingAngle={3}
              stroke="white"
              strokeWidth={2}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              formatter={formatTooltip}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
              }}
            />

            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{
                fontSize: "12px",
                marginTop: "10px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
