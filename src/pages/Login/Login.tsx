import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/Button/Button";
import { LogIn } from "lucide-react";
import styles from "./Login.module.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Email не введён";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email не валидный";
    }
    if (!password) {
      newErrors.password = "Введите Пароль";
    } else if (password.length < 6) {
      newErrors.password = "Пароль должен быть > 6 символов";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setErrors({ form: "Invalid email or password" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Рады снова вас видеть</h2>
          <p className={styles.subtitle}>
            Войдите, чтобы потвердить свой профиль
          </p>
        </div>

        {errors.form && <div className={styles.error}>{errors.form}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${styles.input} ${
                errors.email ? styles.inputError : ""
              }`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className={styles.errorMessage}>{errors.email}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${styles.input} ${
                errors.password ? styles.inputError : ""
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className={styles.errorMessage}>{errors.password}</p>
            )}
          </div>

          <div className={styles.rememberMeContainer}>
            <div className={styles.checkboxContainer}>
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className={styles.checkbox}
              />
              <label htmlFor="remember-me" className={styles.checkboxLabel}>
                Запомнить меня
              </label>
            </div>

            <a href="#" className={styles.forgotPassword}>
              Забыли пароль?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isSubmitting}
            icon={<LogIn size={16} />}
          >
            Войти
          </Button>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              У вас нет учётной записи?{" "}
              <Link to="/register" className={styles.footerLink}>
                Создать её
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
