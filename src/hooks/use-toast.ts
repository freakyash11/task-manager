import { toast as sonnerToast, type ToastOptions, type Toast } from 'sonner';

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