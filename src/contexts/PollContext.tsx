import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Poll } from "../types";

interface PollContextType {
  polls: Poll[];
  loading: boolean;
  getUserPolls: (userId: string) => Poll[];
  getPoll: (id: string) => Poll | undefined;
  createPoll: (poll: Omit<Poll, "id">) => Poll;
  updatePoll: (poll: Poll) => void;
  deletePoll: (id: string) => void;
  votePoll: (pollId: string, optionText: string, userId: string) => void;
  hasUserVoted: (pollId: string, userId: string) => boolean;
}

const PollContext = createContext<PollContextType | undefined>(undefined);

export const usePoll = () => {
  const context = useContext(PollContext);
  if (context === undefined) {
    throw new Error("usePoll must be used within a PollProvider");
  }
  return context;
};

const STORAGE_KEY = "pollwave_polls";
const VOTES_STORAGE_KEY = "pollwave_user_votes";

// Sample data for demonstration
const samplePolls: Poll[] = [
  {
    id: "1",
    title: "Лучший язык программирования?",
    description:
      "Выбери самый лучший язык программирования из предложенных вариантов",
    options: [
      { text: "JavaScript", votes: 45 },
      { text: "Python", votes: 32 },
      { text: "Java", votes: 18 },
      { text: "C#", votes: 12 },
      { text: "Go", votes: 8 },
    ],
    createdAt: "2023-06-15T10:30:00Z",
    endDate: "2025-12-31T23:59:59Z",
    isPublic: true,
    allowComments: true,
    createdBy: "PollWave",
  },
  {
    id: "2",
    title: "Какой фреймворк лучше?",
    description: "Какой frontend фреймворк самый лучший",
    options: [
      { text: "React", votes: 38 },
      { text: "Vue", votes: 22 },
      { text: "Angular", votes: 15 },
      { text: "Svelte", votes: 10 },
    ],
    createdAt: "2023-07-20T14:15:00Z",
    endDate: "2025-12-31T23:59:59Z",
    isPublic: true,
    allowComments: true,
    createdBy: "PollWave",
  },
  {
    id: "3",
    title: "Как часто ты вносишь вклад в opensource?",
    description: "Поделись с нами как часто ты что-то делаешь для народа.",
    options: [
      { text: "Раз в неделю", votes: 12 },
      { text: "Раз в месяц", votes: 28 },
      { text: "Несколько раз за год", votes: 35 },
      { text: "Никогда, но я хочу начать", votes: 22 },
      { text: "Я никогда не вносил вклад в opensourse", votes: 8 },
    ],
    createdAt: "2023-08-05T09:45:00Z",
    endDate: "2025-12-31T23:59:59Z",
    isPublic: true,
    allowComments: false,
    createdBy: "PollWave",
  },
];

export const PollProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [userVotes, setUserVotes] = useState<Record<string, string[]>>({});

  // Load polls and user votes from localStorage on mount
  useEffect(() => {
    const loadPolls = () => {
      const storedPolls = localStorage.getItem(STORAGE_KEY);
      const storedVotes = localStorage.getItem(VOTES_STORAGE_KEY);

      if (storedPolls) {
        try {
          setPolls(JSON.parse(storedPolls));
        } catch (error) {
          console.error("Failed to parse stored polls:", error);
          setPolls(samplePolls);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(samplePolls));
        }
      } else {
        setPolls(samplePolls);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(samplePolls));
      }

      if (storedVotes) {
        try {
          setUserVotes(JSON.parse(storedVotes));
        } catch (error) {
          console.error("Failed to parse stored votes:", error);
          setUserVotes({});
        }
      }

      setLoading(false);
    };

    setTimeout(loadPolls, 800);
  }, []);

  // Save polls and user votes to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(polls));
      localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(userVotes));
    }
  }, [polls, userVotes, loading]);

  const getUserPolls = (userId: string) => {
    return polls;
  };

  const getPoll = (id: string) => {
    return polls.find((poll) => poll.id === id);
  };

  const createPoll = (poll: Omit<Poll, "id">) => {
    const newPoll = { ...poll, id: uuidv4() };
    setPolls((prevPolls) => [...prevPolls, newPoll]);
    return newPoll;
  };

  const updatePoll = (updatedPoll: Poll) => {
    setPolls((prevPolls) =>
      prevPolls.map((poll) => (poll.id === updatedPoll.id ? updatedPoll : poll))
    );
  };

  const deletePoll = (id: string) => {
    setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== id));
  };

  const hasUserVoted = (pollId: string, userId: string) => {
    return userVotes[userId]?.includes(pollId) || false;
  };

  const votePoll = (pollId: string, optionText: string, userId: string) => {
    if (hasUserVoted(pollId, userId)) {
      throw new Error("You have already voted on this poll");
    }

    setPolls((prevPolls) =>
      prevPolls.map((poll) => {
        if (poll.id === pollId) {
          return {
            ...poll,
            options: poll.options.map((option) => {
              if (option.text === optionText) {
                return { ...option, votes: option.votes + 1 };
              }
              return option;
            }),
          };
        }
        return poll;
      })
    );

    setUserVotes((prev) => ({
      ...prev,
      [userId]: [...(prev[userId] || []), pollId],
    }));
  };

  return (
    <PollContext.Provider
      value={{
        polls,
        loading,
        getUserPolls,
        getPoll,
        createPoll,
        updatePoll,
        deletePoll,
        votePoll,
        hasUserVoted,
      }}
    >
      {children}
    </PollContext.Provider>
  );
};
