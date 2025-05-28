import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, BarChart, Plus } from "lucide-react";
import Button from "../../components/Button/Button";
import PollCard from "../../components/PollCard/PollCard";
import { usePoll } from "../../contexts/PollContext";
import { useAuth } from "../../contexts/AuthContext";
import { Poll } from "../../types";
import styles from "./Polls.module.css";

const Polls: React.FC = () => {
  const { polls, loading } = usePoll();
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
      let publicPolls = [...polls].filter((poll) => poll.isPublic);

      // Apply search filter
      if (searchTerm) {
        publicPolls = publicPolls.filter(
          (poll) =>
            poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            poll.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply active/ended filter
      if (filterActive !== "all") {
        const now = new Date();
        publicPolls = publicPolls.filter((poll) => {
          const endDate = new Date(poll.endDate);
          return filterActive === "active" ? endDate > now : endDate <= now;
        });
      }

      // Apply sorting
      publicPolls.sort((a, b) => {
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

      setFilteredPolls(publicPolls);
    }
  }, [polls, loading, searchTerm, sortBy, filterActive]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Public Polls</h1>
          <p className={styles.subtitle}>
            Browse and vote on public polls from our community
          </p>
        </div>

        {user && (
          <Button
            as={Link}
            to="/create"
            variant="primary"
            icon={<Plus size={16} />}
            className={styles.createButton}
          >
            Create Poll
          </Button>
        )}
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
                <option value="all">All Polls</option>
                <option value="active">Active</option>
                <option value="ended">Ended</option>
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
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="mostVotes">Most Votes</option>
                <option value="leastVotes">Least Votes</option>
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
                <PollCard key={poll.id} poll={poll} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <p className={styles.emptyText}>
                No polls found matching your criteria.
              </p>
              {user && (
                <Button
                  as={Link}
                  to="/create"
                  variant="primary"
                  icon={<Plus size={16} />}
                >
                  Create the First Poll
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Polls;
