import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3, PieChart } from "lucide-react";
import Button from "../../components/Button/Button";
import { usePoll } from "../../contexts/PollContext";
import PollResults from "../../components/PollResults/PollResults";
import { Poll } from "../../types";
import styles from "./Results.module.css";

const Results: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPoll, loading } = usePoll();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

  useEffect(() => {
    if (!loading && id) {
      const foundPoll = getPoll(id);
      if (foundPoll) {
        setPoll(foundPoll);
      } else {
        navigate("/not-found");
      }
    }
  }, [id, loading, getPoll, navigate]);

  const toggleChartType = () => {
    setChartType((prev) => (prev === "pie" ? "bar" : "pie"));
  };

  if (loading || !poll) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        <ArrowLeft size={18} className={styles.backIcon} />
        <span>Назад</span>
      </button>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>Результаты: {poll.title}</h1>
              <p className={styles.description}>{poll.description}</p>
            </div>
          </div>
        </div>
        <div className={styles.cardBody}>
          <PollResults poll={poll} chartType={chartType} />
        </div>
      </div>
    </div>
  );
};

export default Results;
