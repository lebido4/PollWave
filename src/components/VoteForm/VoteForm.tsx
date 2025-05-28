import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Poll } from "../../types";
import Button from "../Button/Button";
import styles from "./VoteForm.module.css";
import { usePoll } from "../../contexts/PollContext";
import { useAuth } from "../../contexts/AuthContext";

interface VoteFormProps {
  poll: Poll;
}

const VoteForm: React.FC<VoteFormProps> = ({ poll }) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { votePoll, hasUserVoted } = usePoll();
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOption) {
      setError("Пожалуйста Проголосуйте");
      return;
    }

    if (!user) {
      setError("Вы должны войти для голосования");
      return;
    }

    if (hasUserVoted(poll.id, user.id)) {
      setError("Вы уже голосовали");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      votePoll(poll.id, selectedOption, user.id);
      setTimeout(() => {
        setIsSubmitting(false);
        navigate(`/results/${poll.id}`);
      }, 1000);
    } catch (err) {
      setIsSubmitting(false);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while submitting your vote"
      );
    }
  };

  // Check if poll has ended
  const hasEnded = new Date(poll.endDate) < new Date();
  const hasVoted = user && hasUserVoted(poll.id, user.id);

  if (hasVoted) {
    return (
      <div className={styles.container}>
        <div className={styles.warningMessage}>
          <p className={styles.warningTitle}>Вы уже проголосовали</p>
          <p className={styles.warningText}>Вы можете посмотреть результат</p>
          <Button
            type="button"
            variant="primary"
            className="mt-4"
            onClick={() => navigate(`/results/${poll.id}`)}
          >
            Результат
          </Button>
        </div>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      {hasEnded ? (
        <div className={styles.warningMessage}>
          <p className={styles.warningTitle}>This poll has ended</p>
          <p className={styles.warningText}>
            Voting is no longer available, but you can still view the results.
          </p>
          <Button
            type="button"
            variant="primary"
            className="mt-4"
            onClick={() => navigate(`/results/${poll.id}`)}
          >
            Помотреть результат
          </Button>
        </div>
      ) : (
        <>
          <h3 className={styles.header}>Проголосуй</h3>

          <div className={styles.optionsContainer}>
            {poll.options.map((option, index) => (
              <div
                key={index}
                className={`${styles.option} ${
                  selectedOption === option.text ? styles.optionSelected : ""
                }`}
                onClick={() => setSelectedOption(option.text)}
              >
                <div className={styles.optionContent}>
                  <div className={styles.radio}>
                    {selectedOption === option.text && (
                      <div className={styles.radioInner}></div>
                    )}
                  </div>
                  <span className={styles.optionText}>{option.text}</span>
                </div>
              </div>
            ))}
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.footer}>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Назад
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={!selectedOption || isSubmitting}
            >
              Отправить голос
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default VoteForm;
