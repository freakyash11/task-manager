import { toast as sonnerToast } from 'sonner';
import React from 'react';

type ToastOptions = {
  duration?: number;
  style?: React.CSSProperties;
  className?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  description?: string;
};

type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export const toast = ({
  title,
  description,
  variant = 'default',
  duration = 3000,
  action,
}: ToastProps) => {
  const options: ToastOptions = {
    duration,
    style: {
      borderColor: variant === 'destructive' ? 'var(--destructive)' : undefined,
    },
    className: variant === 'destructive' ? 'destructive' : undefined,
  };

  if (action) {
    options.action = {
      label: action.label,
      onClick: action.onClick,
    };
  }

  return sonnerToast(title || '', {
    ...options,
    description,
  });
};

export type { ToastProps }; 