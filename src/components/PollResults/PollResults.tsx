import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Poll } from "../../types";
import styles from "./PollResults.module.css";

interface PollResultsProps {
  poll: Poll;
  chartType?: "pie" | "bar";
}

const COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#F97316",
  "#10B981",
  "#14B8A6",
  "#06B6D4",
  "#6366F1",
  "#8B5CF6",
  "#D946EF",
  "#F43F5E",
  "#EF4444",
];

const PollResults: React.FC<PollResultsProps> = ({
  poll,
  chartType = "Chaваrt",
}) => {
  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );

  const data = poll.options.map((option, index) => ({
    name: option.text,
    value: option.votes,
    percentage:
      totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : "0",
  }));

  // Sort data by votes in descending order
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipTitle}>{payload[0].name}</p>
          <p className={styles.tooltipContent}>
            Голосов: {payload[0].value} ({payload[0].payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (totalVotes === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyStateText}>Голосов ещё нет, сделай первый</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Результаты</h3>
        <p className={styles.totalVotes}>{totalVotes} Голосов</p>
      </div>

      <div className={styles.content}>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                height={60}
                tickMargin={5}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.resultsList}>
          <div className={styles.resultsCard}>
            <h4 className={styles.resultsCardTitle}>Детальный результат</h4>
            <div>
              {sortedData.map((item, index) => (
                <div key={index} className={styles.resultItem}>
                  <div className={styles.resultHeader}>
                    <span className={styles.resultLabel}>{item.name}</span>
                    <span className={styles.resultValue}>
                      {item.value} Голосов ({item.percentage}%)
                    </span>
                  </div>
                  <div className={styles.resultBar}>
                    <div
                      className={styles.resultBarFill}
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollResults;
