import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';

export class ValueSelect {
  id: string;
  value: string;

  constructor(id: string, value: string) {
    this.id = id;
    this.value = value;
  }
}

interface Props {
  label: string;
  options: ValueSelect[];
  selected: ValueSelect | ValueSelect[] | null;
  onSelect: (value: ValueSelect | ValueSelect[] | null) => void;
  multiple?: boolean;
  error?: boolean;
  helperText?: string;
}

export const SelectCustom = ({
  label,
  options,
  selected,
  onSelect,
  multiple = false,
  error = false,
  helperText = '',
}: Props) => {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false); // 👈 NUEVO
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* =========================
     Cerrar al hacer click fuera
  ========================= */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        if (!multiple) setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [multiple]);

  /* =========================
     Select logic
  ========================= */
  const handleSelect = (id: string) => {
    const found = options.find((opt) => opt.id === id);
    if (!found) return;

    if (multiple) {
      const current = Array.isArray(selected) ? selected : [];
      const exists = current.find((item) => item.id === id);

      if (exists) {
        onSelect(current.filter((item) => item.id !== id));
      } else {
        onSelect([...current, found]);
      }
    } else {
      onSelect(found);
      setOpen(false);
    }

    if (!multiple) setSearch('');
  };

  const isSelected = (id: string) => {
    if (multiple && Array.isArray(selected)) {
      return selected.some((item) => item.id === id);
    }
    return (selected as ValueSelect | null)?.id === id;
  };

  const renderLabel = () => {
    if (multiple) return 'Agregar opciones...';
    if (!multiple && selected) return (selected as ValueSelect).value;
    return 'Seleccionar...';
  };

  const filteredOptions = options.filter((opt) =>
    opt.value.toLowerCase().includes(search.toLowerCase())
  );

  /* =========================
     Detectar espacio (ARRIBA / ABAJO)
  ========================= */
  const toggleDropdown = () => {
    if (!open) {
      const rect = dropdownRef.current?.getBoundingClientRect();
      if (rect) {
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        // 👇 260px ≈ alto del dropdown
        setOpenUp(spaceBelow < 260 && spaceAbove > spaceBelow);
      }
    }
    setOpen(!open);
  };

  /* =========================
     Render
  ========================= */
  return (
    <div className="w-full relative" ref={dropdownRef}>
      <label className="block text-sm font-medium mb-1">{label}</label>

      {/* ================= INPUT ================= */}
      <div
        onClick={toggleDropdown}
        className={`w-full border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md bg-white cursor-pointer px-2 py-2 flex items-start justify-between min-h-[40px]`}
      >
        <div className="flex flex-wrap gap-1 flex-1 items-center">
          {multiple ? (
            Array.isArray(selected) && selected.length > 0 ? (
              selected.map((item) => (
                <span
                  key={item.id}
                  className="flex items-center gap-1 bg-primary text-white text-xs px-2 py-1 rounded-full"
                >
                  {item.value}
                  <button
                    type="button"
                    className="ml-1 text-white/80 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(
                        selected.filter((s) => s.id !== item.id)
                      );
                    }}
                  >
                    ✕
                  </button>
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-400 select-none px-1">
                Seleccionar...
              </span>
            )
          ) : (
            <span
              className={`text-sm ${
                selected ? 'text-gray-800' : 'text-gray-400'
              } select-none px-1`}
            >
              {renderLabel()}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-500 mt-1 shrink-0 transition-transform ${
            open && openUp ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* ================= DROPDOWN ================= */}
      {open && (
        <div
          className={`absolute left-0 right-0 z-[9999] bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-hidden
            ${openUp ? 'bottom-full mb-1' : 'top-full mt-1'}
          `}
        >
          {/* 🔍 Search */}
          <div className="flex items-center border-b border-gray-200 px-3 py-2">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full outline-none text-sm text-gray-700"
            />
          </div>

          {/* Options */}
          <ul className="max-h-48 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className={`transition-colors duration-150 px-4 py-2 cursor-pointer flex items-center justify-between ${
                    isSelected(opt.id)
                      ? 'bg-primary font-semibold text-white'
                      : 'hover:bg-primary-100'
                  }`}
                >
                  <span>{opt.value}</span>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-gray-400 text-center select-none">
                No se encontraron resultados
              </li>
            )}
          </ul>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 mt-1">{helperText}</p>
      )}
    </div>
  );
};
