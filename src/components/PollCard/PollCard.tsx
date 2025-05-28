import React from "react";
import { Link } from "react-router-dom";
import { Users, BarChart, Share2 } from "lucide-react";
import { Poll } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./PollCard.module.css";

interface PollCardProps {
  poll: Poll;
}

const PollCard: React.FC<PollCardProps> = ({ poll }) => {
  const { user } = useAuth();
  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );
  const maxVotes = Math.max(...poll.options.map((option) => option.votes));
  const leadingOption = poll.options.find(
    (option) => option.votes === maxVotes
  );

  const progressPercentage = totalVotes > 0 ? (maxVotes / totalVotes) * 100 : 0;

  const isActive = new Date(poll.endDate) > new Date();

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.header}>
          <h3 className={styles.title}>{poll.title}</h3>
          <div
            className={`${styles.statusBadge} ${
              isActive ? styles.statusBadgeActive : styles.statusBadgeEnded
            }`}
          >
            {isActive ? "Active" : "Ended"}
          </div>
        </div>

        <p className={styles.description}>{poll.description}</p>

        {/* Leading option */}
        {totalVotes > 0 && (
          <div className={styles.leadingOption}>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>
                Лидирует: {leadingOption?.text}
              </span>
              <span className={styles.progressValue}>
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className={styles.stats}>
          <Users size={16} className={styles.statsIcon} />
          <span>{totalVotes} votes</span>
        </div>
        <div className={styles.footer}>
          {user ? (
            <Link to={`/vote/${poll.id}`} className={styles.voteButton}>
              Проголосуй
            </Link>
          ) : (
            <Link
              to={`/login?redirect=/vote/${poll.id}`}
              className={styles.voteButton}
            >
              Войти для голосования
            </Link>
          )}

          <div className={styles.actionButtons}>
            <Link
              to={`/results/${poll.id}`}
              className={styles.actionButton}
              title="Посмотреть Результат"
            >
              <BarChart size={18} />
            </Link>
            <button
              className={styles.actionButton}
              title="Share Poll"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/vote/${poll.id}`
                );
                alert("Poll link copied to clipboard!");
              }}
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollCard;
