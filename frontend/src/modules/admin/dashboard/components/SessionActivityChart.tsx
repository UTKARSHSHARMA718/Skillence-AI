"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Data = {
  date: string;
  count: number;
};

export const SessionActivityChart = ({
  data,
}: {
  data?: Data[];
}) => {
  const chartData = data && data.length > 0 ? data : [];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
        />

        <YAxis allowDecimals={false} />

        <Tooltip />

        <Bar
          dataKey="count"
          fill="#111827"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};