"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

const inputClasses =
  "focus-ring h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500 aria-[invalid=true]:border-red-400";

interface FieldWrapperProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  id: string;
  children: React.ReactNode;
}

function FieldWrapper({ label, error, hint, required, id, children }: FieldWrapperProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-brand-600">*</span>}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField({ label, error, hint, required, className, ...props }, ref) {
    const id = useId();
    return (
      <FieldWrapper label={label} error={error} hint={hint} required={required} id={id}>
        <input
          ref={ref}
          id={id}
          aria-invalid={Boolean(error)}
          className={cn(inputClasses, className)}
          {...props}
        />
      </FieldWrapper>
    );
  },
);

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  options: Array<{ value: string | number; label: string }>;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField({ label, error, hint, required, placeholder, options, className, ...props }, ref) {
    const id = useId();
    return (
      <FieldWrapper label={label} error={error} hint={hint} required={required} id={id}>
        <select
          ref={ref}
          id={id}
          aria-invalid={Boolean(error)}
          className={cn(inputClasses, "appearance-none pr-8", className)}
          defaultValue={props.defaultValue ?? (props.value === undefined ? "" : undefined)}
          {...props}
        >
          {placeholder !== undefined && (
            // In required form fields the placeholder is a locked prompt;
            // in filters it stays selectable as the "all" option.
            <option value="" disabled={required}>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FieldWrapper>
    );
  },
);
