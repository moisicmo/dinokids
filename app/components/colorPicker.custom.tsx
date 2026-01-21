import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ColorOption {
  value: string;
  label: string;
  tailwindClass?: string;
}

interface ColorPickerCustomProps {
  value: string | null;
  onChange: (color: string) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  colors?: ColorOption[];
}

// Paleta de colores por defecto
const DEFAULT_COLORS: ColorOption[] = [
  { value: "#3B82F6", label: "Azul", tailwindClass: "bg-blue-500" },
  { value: "#EF4444", label: "Rojo", tailwindClass: "bg-red-500" },
  { value: "#10B981", label: "Verde", tailwindClass: "bg-emerald-500" },
  { value: "#F59E0B", label: "Ámbar", tailwindClass: "bg-amber-500" },
  { value: "#8B5CF6", label: "Violeta", tailwindClass: "bg-violet-500" },
  { value: "#EC4899", label: "Rosa", tailwindClass: "bg-pink-500" },
  { value: "#06B6D4", label: "Cian", tailwindClass: "bg-cyan-500" },
  { value: "#84CC16", label: "Lima", tailwindClass: "bg-lime-500" },
  { value: "#F97316", label: "Naranja", tailwindClass: "bg-orange-500" },
  { value: "#A855F7", label: "Púrpura", tailwindClass: "bg-purple-500" },
  { value: "#14B8A6", label: "Turquesa", tailwindClass: "bg-teal-500" },
  { value: "#6366F1", label: "Índigo", tailwindClass: "bg-indigo-500" },
];

export const ColorPickerCustom = ({
  value,
  onChange,
  label,
  error = false,
  helperText = "",
  colors = DEFAULT_COLORS,
}: ColorPickerCustomProps) => {
  const selectedColor = colors.find(color => color.value === value);

  return (
    <div className="grid w-full gap-1.5">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-10",
              error && "border-red-500",
              !value && "text-muted-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              {selectedColor ? (
                <>
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: selectedColor.value }}
                  />
                  <span>{selectedColor.label}</span>
                </>
              ) : (
                <>
                  <Palette className="h-4 w-4 opacity-50" />
                  <span>Seleccionar color</span>
                </>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => onChange(color.value)}
                className="relative flex items-center justify-center"
                title={color.label}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110",
                    color.tailwindClass
                  )}
                  style={{ 
                    backgroundColor: color.tailwindClass ? undefined : color.value,
                    borderColor: value === color.value ? color.value : "transparent"
                  }}
                >
                  {value === color.value && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
          
          {/* Opción personalizada */}
          <div className="mt-4 pt-4 border-t">
            <label className="block text-sm font-medium mb-2">
              Color personalizado
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={value || "#3B82F6"}
                onChange={(e) => onChange(e.target.value)}
                className="w-10 h-10 cursor-pointer rounded border"
              />
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#3B82F6"
                className="flex-1 h-10 px-3 rounded border text-sm"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {helperText && (
        <p className={cn("text-sm", error ? "text-red-600" : "text-muted-foreground")}>
          {helperText}
        </p>
      )}
    </div>
  );
};