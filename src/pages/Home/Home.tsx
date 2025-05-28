import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChartBig } from "lucide-react";
import Button from "../../components/Button/Button";
import PollCard from "../../components/PollCard/PollCard";
import { usePoll } from "../../contexts/PollContext";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Home.module.css";

const Home: React.FC = () => {
  const { polls, loading } = usePoll();
  const { user } = useAuth();
  const [recentPolls, setRecentPolls] = useState([]);

  useEffect(() => {
    const filtered = polls
      .filter((poll) => poll.isPublic)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 6);

    setRecentPolls(filtered);
  }, [polls]);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>Голосуй на PollWave</h1>
            <p className={styles.heroDescription}>
              Удобная платформа для создания опросов, анкетирования и госования.
              Получайте результаты в режиме реального времени и ценную
              информацию от своей аудитории.
            </p>
            <div className={styles.heroButtons}>
              <Button
                as={Link}
                to={user ? "/create" : "/register"}
                variant="primary"
                size="lg"
                className={styles.primaryButton}
              >
                {user ? "Создать опрос" : "Начать работу"}
              </Button>

              <Button
                as={Link}
                to={user ? "/dashboard" : "/login"}
                variant="primary"
                size="lg"
                className={styles.outlineButton}
              >
                {user ? "Посмотреть Опросы" : "Войти"}
              </Button>
            </div>
          </div>

          <div className={styles.heroGraphic}>
            <BarChartBig className={styles.heroIcon} />
          </div>
        </div>
      </div>

      <section className={styles.recentPolls}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Последнии изменения</h2>
            <Link to="/polls" className={styles.viewAllLink}>
              Посмотреть всё
            </Link>
          </div>

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
            </div>
          ) : (
            <div className={styles.pollGrid}>
              {recentPolls.length > 0 ? (
                recentPolls.map((poll) => (
                  <PollCard key={poll.id} poll={poll} />
                ))
              ) : (
                <p className={styles.emptyMessage}>К сожалению пока пусто</p>
              )}
            </div>
          )}

          <div className={styles.sectionFooter}>
            <Button
              as={Link}
              to={user ? "/create" : "/register"}
              variant="primary"
              className={styles.createButton}
            >
              {user ? "Создать Опрос" : "Присоединиться, чтобы создавать"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
