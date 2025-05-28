import React from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonOwnProps {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

type ButtonProps<C extends React.ElementType> = ButtonOwnProps & {
  as?: C;
} & React.ComponentPropsWithoutRef<C>;

const Button = <C extends React.ElementType = "button">({
  as,
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps<C>) => {
  const Component = as || "button";

  const buttonClasses = [
    styles.button,
    styles[size],
    styles["primary"],
    fullWidth && styles.fullWidth,
    isLoading && styles.loading,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component
      className={buttonClasses}
      disabled={Component === "button" ? isLoading || disabled : undefined}
      {...props}
    >
      {isLoading && (
        <svg
          className={styles.spinner}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {!isLoading && icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </Component>
  );
};

export default Button;
