import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/Button/Button";
import { UserPlus } from "lucide-react";
import styles from "./Register.module.css";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Введите Имя";
    }

    if (!email.trim()) {
      newErrors.email = "Введите Email";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email не валидый";
    }

    if (!password) {
      newErrors.password = "Введите Пароль";
    } else if (password.length < 6) {
      newErrors.password = "Пароль должен быть > 6 символов";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Пароли отличаются";
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
      await register(email, password, name);
      navigate("/dashboard");
    } catch (error) {
      setErrors({ form: "Registration failed. Повторите попытку позже" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Создать учёную запись</h2>
          <p className={styles.subtitle}>
            Присоединяйтесь PollWave и начнём творить вместе.
          </p>
        </div>

        {errors.form && <div className={styles.error}>{errors.form}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              ФИО
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${styles.input} ${
                errors.name ? styles.inputError : ""
              }`}
              placeholder="Иван Иванов"
            />
            {errors.name && (
              <p className={styles.errorMessage}>{errors.name}</p>
            )}
          </div>

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
              autoComplete="new-password"
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

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Подтверждение пароля
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${styles.input} ${
                errors.confirmPassword ? styles.inputError : ""
              }`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className={styles.errorMessage}>{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isSubmitting}
            icon={<UserPlus size={16} />}
          >
            Зарегистрироваться
          </Button>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              У вас есть уже учётная запись?{" "}
              <Link to="/login" className={styles.footerLink}>
                Войти
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
