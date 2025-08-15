"use client";

import { ReactNode } from "react";

interface ButtonProps {
  variant: "primary" | "secondary" | "outline"
  children?: ReactNode;
  className?: string;
  appName?: string;
  size: "lg" | "sm";
  onClick?: () => void
}

const variantStyle = {
  primary: "bg-blue-500",
  secondary: "bg-sky-500",
  outline: "border-1"
}

export const Button = ({ children, className, appName, size, onClick, variant }: ButtonProps) => {
  return (
    <button
      className={`${className} ${size} ${variantStyle[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
