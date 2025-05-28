import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Share2, ArrowLeft, Edit, Trash2 } from "lucide-react";
import Button from "../../components/Button/Button";
import { usePoll } from "../../contexts/PollContext";
import { useAuth } from "../../contexts/AuthContext";
import PollResults from "../../components/PollResults/PollResults";
import { Poll } from "../../types";
import styles from "./PollDetails.module.css";

const PollDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPoll, deletePoll, loading } = usePoll();
  const { user } = useAuth();
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

  const handleDeletePoll = () => {
    if (window.confirm("Вы точно хотите удалить опрос?")) {
      if (id) {
        deletePoll(id);
        navigate("/dashboard");
      }
    }
  };

  const handleSharePoll = () => {
    const pollUrl = `${window.location.origin}/vote/${id}`;
    navigator.clipboard.writeText(pollUrl);
    alert("Ссылка на опрос");
  };

  if (loading || !poll) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  const isActive = new Date(poll.endDate) > new Date();
  const isCreator = true; // In a real app, check if user is the creator

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        <ArrowLeft size={18} className={styles.backIcon} />
        <span>Back</span>
      </button>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>
                {poll.title}
                <div
                  className={`${styles.badge} ${
                    isActive ? styles.badgeActive : styles.badgeEnded
                  }`}
                >
                  {isActive ? "Active" : "Ended"}
                </div>
              </h1>
              <p className={styles.description}>{poll.description}</p>
              <div className={styles.metadata}>
                <span>
                  Created: {new Date(poll.createdAt).toLocaleDateString()}
                </span>
                <span className={styles.metadataDivider}>•</span>
                <span>Ends: {new Date(poll.endDate).toLocaleDateString()}</span>
              </div>
            </div>

            {isCreator && user && (
              <div className={styles.actionButtons}>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Share2 size={16} />}
                  onClick={handleSharePoll}
                >
                  Share
                </Button>
                <Button variant="outline" size="sm" icon={<Edit size={16} />}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon={<Trash2 size={16} />}
                  onClick={handleDeletePoll}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.resultsSection}>
            <PollResults poll={poll} />
          </div>

          {isActive && (
            <div className={styles.voteButton}>
              <Button as={Link} to={`/vote/${id}`} variant="primary" size="lg">
                Vote Now
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PollDetails;
