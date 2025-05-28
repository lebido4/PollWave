import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Search, Filter, BarChart } from "lucide-react";
import Button from "../../components/Button/Button";
import PollCard from "../../components/PollCard/PollCard";
import { usePoll } from "../../contexts/PollContext";
import { useAuth } from "../../contexts/AuthContext";
import { Poll } from "../../types";
import styles from "./Dashboard.module.css";

const Dashboard: React.FC = () => {
  const { polls, loading, deletePoll } = usePoll();
  const { user } = useAuth();
  const [filteredPolls, setFilteredPolls] = useState<Poll[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "mostVotes" | "leastVotes"
  >("newest");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "ended">(
    "all"
  );

  useEffect(() => {
    if (!loading) {
      let userPolls = [...polls];

      if (searchTerm) {
        userPolls = userPolls.filter(
          (poll) =>
            poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            poll.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filterActive !== "all") {
        const now = new Date();
        userPolls = userPolls.filter((poll) => {
          const endDate = new Date(poll.endDate);
          return filterActive === "active" ? endDate > now : endDate <= now;
        });
      }

      userPolls.sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "oldest":
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          case "mostVotes": {
            const totalVotesA = a.options.reduce(
              (sum, option) => sum + option.votes,
              0
            );
            const totalVotesB = b.options.reduce(
              (sum, option) => sum + option.votes,
              0
            );
            return totalVotesB - totalVotesA;
          }
          case "leastVotes": {
            const totalVotesA = a.options.reduce(
              (sum, option) => sum + option.votes,
              0
            );
            const totalVotesB = b.options.reduce(
              (sum, option) => sum + option.votes,
              0
            );
            return totalVotesA - totalVotesB;
          }
          default:
            return 0;
        }
      });

      setFilteredPolls(userPolls);
    }
  }, [polls, loading, searchTerm, sortBy, filterActive]);

  const handleDeletePoll = (id: string) => {
    if (window.confirm("Are you sure you want to delete this poll?")) {
      deletePoll(id);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Опросы</h1>
          <p className={styles.subtitle}>Выбирай и голосуй</p>
        </div>

        <Button
          as={Link}
          to="/create"
          variant="primary"
          icon={<Plus size={16} />}
          className={styles.createButton}
        >
          Создать новый
        </Button>
      </div>

      <div className={styles.filters}>
        <div className={styles.filtersContent}>
          <div className={styles.searchContainer}>
            <div className={styles.searchIcon}>
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search polls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterControls}>
            <div className={styles.filterSelect}>
              <div className={styles.filterIcon}>
                <Filter size={18} />
              </div>
              <select
                value={filterActive}
                onChange={(e) =>
                  setFilterActive(e.target.value as "all" | "active" | "ended")
                }
                className={styles.select}
              >
                <option value="all">Все Опросы</option>
                <option value="active">Активные</option>
                <option value="ended">Законченные</option>
              </select>
            </div>

            <div className={styles.filterSelect}>
              <div className={styles.filterIcon}>
                <BarChart size={18} />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={styles.select}
              >
                <option value="newest">Новые</option>
                <option value="oldest">Старые</option>
                <option value="mostVotes">Больше голосов</option>
                <option value="leastVotes">Меньше голосов</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <>
          {filteredPolls.length > 0 ? (
            <div className={styles.pollGrid}>
              {filteredPolls.map((poll) => (
                <div key={poll.id} className={styles.pollCard}>
                  <PollCard poll={poll} />
                  <button
                    onClick={() => handleDeletePoll(poll.id)}
                    className={styles.deleteButton}
                    title="Delete poll"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <p className={styles.emptyText}>Опросов пока нет.</p>
              <Button
                as={Link}
                to="/create"
                variant="primary"
                icon={<Plus size={16} />}
              >
                Создать Новый
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
