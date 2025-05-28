import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, X, HelpCircle, Calendar, AlertCircle } from "lucide-react";
import Button from "../Button/Button";
import { usePoll } from "../../contexts/PollContext";
import styles from "./PollForm.module.css";

const PollForm: React.FC = () => {
  const navigate = useNavigate();
  const { createPoll } = usePoll();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [endDate, setEndDate] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Заполните Заголовок";
    }

    if (!description.trim()) {
      newErrors.description = "Заполните Описание";
    }

    const validOptions = options.filter((opt) => opt.trim() !== "");
    if (validOptions.length < 2) {
      newErrors.options = "Заполните как минимум две опции";
    }

    const hasDuplicates = validOptions.length !== new Set(validOptions).size;
    if (hasDuplicates) {
      newErrors.options = "Опции должны быть уникальны";
    }

    if (!endDate) {
      newErrors.endDate = "Ошибка Даты";
    } else {
      const selectedDate = new Date(endDate);
      const today = new Date();

      if (selectedDate <= today) {
        newErrors.endDate = "Дата должна быть в будущем";
      }
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
      const validOptions = options
        .filter((opt) => opt.trim() !== "")
        .map((text) => ({
          text,
          votes: 0,
        }));

      await createPoll({
        id: "",
        title: title.trim(),
        description: description.trim(),
        options: validOptions,
        createdAt: new Date().toISOString(),
        endDate,
        isPublic,
        allowComments,
        createdBy: "Current User",
      });

      navigate("/dashboard");
    } catch (error) {
      setErrors({ submit: "Failed to create poll. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {errors.submit && (
        <div className={styles.errorAlert}>
          <AlertCircle size={16} />
          <span>{errors.submit}</span>
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          Заголовок опроса <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
          placeholder="Задайте тему опроса?"
          maxLength={50}
        />
        {errors.title ? (
          <p className={styles.errorMessage}>{errors.title}</p>
        ) : (
          <p className={styles.helpText}>Максимум 50 символов</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Описание <span className={styles.required}>*</span>
        </label>
        <textarea
          id="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={`${styles.input} ${styles.textarea} ${
            errors.description ? styles.inputError : ""
          }`}
          placeholder="Опишите ваш опрос"
          maxLength={500}
        />
        {errors.description ? (
          <p className={styles.errorMessage}>{errors.description}</p>
        ) : (
          <p className={styles.helpText}>Максимум 500 символов</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Выбор <span className={styles.required}>*</span>
        </label>
        <div className={styles.optionsContainer}>
          {options.map((option, index) => (
            <div key={index} className={styles.optionRow}>
              <div className={styles.optionNumber}>{index + 1}</div>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className={`${styles.input} ${
                  errors.options ? styles.inputError : ""
                }`}
                placeholder={`Опция ${index + 1}`}
                maxLength={100}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className={styles.removeOption}
                  aria-label="Удалить опцию"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.options ? (
          <p className={styles.errorMessage}>{errors.options}</p>
        ) : (
          <p className={styles.helpText}>Добавить две опции</p>
        )}

        <button
          type="button"
          onClick={addOption}
          className={styles.addOptionButton}
        >
          <PlusCircle size={16} />
          <span>Добавить выбор</span>
        </button>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="endDate" className={styles.label}>
            Конец голосования <span className={styles.required}>*</span>
          </label>
          <div className={styles.inputWithIcon}>
            <Calendar size={16} className={styles.inputIcon} />
            <input
              type="datetime-local"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`${styles.input} ${
                errors.endDate ? styles.inputError : ""
              }`}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
          {errors.endDate && (
            <p className={styles.errorMessage}>{errors.endDate}</p>
          )}
        </div>
      </div>

      <div className={styles.formActions}>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/dashboard")}
        >
          Назад
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          Создать
        </Button>
      </div>
    </form>
  );
};

export default PollForm;
