import { ButtonHTMLAttributes, ReactNode } from 'react';

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: 'blue' | 'red';
}

export default function SecondaryButton({ 
  children, 
  className = '', 
  variant = 'blue',
  ...props 
}: SecondaryButtonProps) {
  const variantClasses = {
    blue: 'text-blue-500 hover:bg-blue-50',
    red: 'text-red-500 hover:bg-red-50'
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg transition-colors ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 