import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import VoteForm from "../../components/VoteForm/VoteForm";
import { usePoll } from "../../contexts/PollContext";
import { Poll } from "../../types";
import styles from "./VotePage.module.css";

const VotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPoll, loading } = usePoll();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);

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
          <h1 className={styles.title}>{poll.title}</h1>
          <p className={styles.description}>{poll.description}</p>

          <div className={styles.endDate}>
            <span>Конец: {new Date(poll.endDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <VoteForm poll={poll} />
    </div>
  );
};

export default VotePage;
