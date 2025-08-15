import { ButtonHTMLAttributes, forwardRef } from "react";

const mergeClasses = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger";
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantStyles = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    return (
      <button
        ref={ref}
        className={mergeClasses(baseStyles, variantStyles[variant], className)}
        {...props}
      />
    );
  }
);
