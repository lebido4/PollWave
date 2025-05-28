import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, BarChartBig, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.logo}>
            <Link to="/" className={styles.logo}>
              <BarChartBig className={styles.logoIcon} />
              <span className={styles.logoText}>PollWave</span>
            </Link>
          </div>

          <div className={styles.desktopMenu}>
            <Link to="/" className={styles.link}>
              Home
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className={styles.link}>
                  Мои Опросы
                </Link>
                <Link to="/create" className={styles.createButton}>
                  Создать Опрос
                </Link>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  <LogOut className={styles.logoutIcon} /> Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.link}>
                  Войти
                </Link>
                <Link to="/register" className={styles.createButton}>
                  Зарегистрироваться
                </Link>
              </>
            )}
          </div>

          <div className={styles.mobileMenuButton}>
            <button onClick={toggleMenu} className={styles.menuIcon}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ""}`}>
        <div className={styles.mobileMenuContent}>
          <Link
            to="/"
            className={styles.mobileLink}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Мои Опросы
              </Link>
              <Link
                to="/create"
                className={styles.mobileCreateButton}
                onClick={() => setIsMenuOpen(false)}
              >
                Создать Опрос
              </Link>
              <button
                onClick={handleLogout}
                className={styles.mobileLogoutButton}
              >
                <LogOut className={styles.logoutIcon} /> Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Войти
              </Link>
              <Link
                to="/register"
                className={styles.createButton}
                onClick={() => setIsMenuOpen(false)}
              >
                Зарегистрироваться
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
