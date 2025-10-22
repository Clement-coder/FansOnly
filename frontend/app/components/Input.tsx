import React from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  isTextArea?: boolean;
}

const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ className, type, icon, isTextArea, ...props }, ref) => {
    const inputClasses = `
      flex w-full bg-transparent px-3 py-2 text-sm
      placeholder:text-muted-foreground focus-visible:outline-none
      disabled:cursor-not-allowed disabled:opacity-50
      ${icon ? 'pl-10' : ''} // Add padding for icon
      ${isTextArea ? 'min-h-[80px] resize-y' : 'h-10'}
    `;

    const containerClasses = `
      relative flex items-center rounded-md border border-input bg-background
      focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background
      transition-all duration-300 ease-in-out
      ${className}
    `;

    return (
      <motion.div
        className={containerClasses}
        whileFocus={{ boxShadow: "0 0 0 2px var(--ring), 0 0 0 4px var(--ring-offset-color)" }}
        transition={{ duration: 0.2 }}
      >
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>}
        {isTextArea ? (
          <textarea
            className={inputClasses}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            type={type}
            className={inputClasses}
            ref={ref as React.Ref<HTMLInputElement>}
            {...props}
          />
        )}
      </motion.div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
