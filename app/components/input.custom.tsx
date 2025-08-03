import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface Props {
  id?: string;
  name: string;
  value: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  label?: string;
  placeholder?: string;
  endAdornment?: ReactNode;
  multiline?: boolean;
  error?: boolean;
  helperText?: string;
  className?: string;
}

export const InputCustom = ({
  id,
  name,
  value,
  onChange,
  type = "text",
  label,
  placeholder,
  endAdornment,
  multiline = false,
  error = false,
  helperText = "",
  className = "",
}: Props) => {
  const inputId = id || name;

  const baseInput = multiline ? (
    <Textarea
      id={inputId}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn("pr-10", error && "border-red-500", className)}
      rows={4}
    />
  ) : (
    <Input
      id={inputId}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn("pr-10", error && "border-red-500", className)}
      autoComplete="off"
    />
  );

  return (
    <div className="grid w-full gap-1.5">
      {label && <Label htmlFor={inputId}>{label}</Label>}

      <div className="relative">
        {baseInput}
        {endAdornment && (
          <div className="absolute inset-y-0 right-3 flex items-center text-gray-500">
            {endAdornment}
          </div>
        )}
      </div>

      {helperText && (
        <p className={cn("text-sm", error ? "text-red-600" : "text-muted-foreground")}>
          {helperText}
        </p>
      )}
    </div>
  );
};
