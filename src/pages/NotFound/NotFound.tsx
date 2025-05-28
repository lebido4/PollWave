import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import { Home } from "lucide-react";
import styles from "./NotFound.module.css";

const NotFound: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Страница не найдена</h2>
        <p className={styles.description}>Sorry, похоже тут ничего нет</p>
        <Button as={Link} to="/" variant="primary" icon={<Home size={16} />}>
          Идти обратно
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
