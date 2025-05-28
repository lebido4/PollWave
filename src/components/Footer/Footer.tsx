import React from "react";
import { Github } from "lucide-react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.divider}>
          <div className={styles.bottomSection}>
            <p className={styles.copyright}>
              &copy; {new Date().getFullYear()} PollWave
            </p>
            <div className={styles.bottomLinks}>
              <a href="#" className={styles.listItem}>
                О проекте
              </a>
              <a href="#" className={styles.listItem}>
                Помощь
              </a>
              <a href="#" className={styles.listItem}>
                Конфиденциальность
              </a>
              <a
                href="https://github.com/lebido4"
                className={styles.socialIcon}
                target="_blank"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
