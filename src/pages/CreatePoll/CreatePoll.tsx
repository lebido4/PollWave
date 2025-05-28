import React from "react";
import PollForm from "../../components/PollForm/PollForm";
import styles from "./CreatePoll.module.css";

const CreatePoll: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Создать Новый Опрос</h1>
        <p className={styles.description}>Заполни поля</p>
        <PollForm />
      </div>
    </div>
  );
};

export default CreatePoll;
