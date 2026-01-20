import { useRef } from 'react';
import { ChevronDown, ChevronUp, Plus, X, Lock } from 'lucide-react';
import { Button, InputCustom, SelectCustom } from '@/components';
import { useForm } from '@/hooks';

interface Props {
  onClose: () => void;
  item?: any; // data del backend (opcional)
}

/* =========================
   HELPERS
========================= */
const createEmptyObjective = () => ({
  smart: '',
  resources: '',
  status: '',
  date: '',
  observations: '',
});

const createEmptyWeek = (weekNumber: number) => ({
  weekNumber,
  areaTrabajo: '',
  expanded: false,
  locked: false,
  objectives: [createEmptyObjective()],
});

export const WeeklyPlanningModal = ({ onClose, item }: Props) => {

  /* =========================
     INITIAL FORM (🔥 CLAVE)
     - Se crea SOLO una vez
     - Compatible con backend o vacío
  ========================= */
  const initialFormRef = useRef<any>(null);

  if (!initialFormRef.current) {
    initialFormRef.current = (() => {
      if (item && Array.isArray(item.weeks)) {
        return {
          weeks: item.weeks.map((w: any, i: number) => ({
            weekNumber: w.weekNumber ?? i + 1,
            areaTrabajo: w.areaTrabajo ?? '',
            expanded: false,
            locked: !!w.locked,
            objectives: Array.isArray(w.objectives)
              ? w.objectives
              : [createEmptyObjective()],
          })),
        };
      }

      // 🔹 DEFAULT → 1 semana
      return {
        weeks: [createEmptyWeek(1)],
      };
    })();
  }

  const { formState, onValueChange } = useForm(initialFormRef.current);

  /* =========================
     HANDLERS
  ========================= */
  const addWeek = () => {
    const weeks = [...formState.weeks];
    weeks.push(createEmptyWeek(weeks.length + 1));
    onValueChange('weeks', weeks);
  };

  const toggleExpand = (index: number) => {
    const weeks = [...formState.weeks];
    weeks[index] = {
      ...weeks[index],
      expanded: !weeks[index].expanded,
    };
    onValueChange('weeks', weeks);
  };

  const toggleLock = (index: number) => {
    const weeks = [...formState.weeks];
    weeks[index] = {
      ...weeks[index],
      locked: !weeks[index].locked,
    };
    onValueChange('weeks', weeks);
  };

  const addObjective = (weekIndex: number) => {
    const weeks = [...formState.weeks];
    weeks[weekIndex] = {
      ...weeks[weekIndex],
      objectives: [
        ...weeks[weekIndex].objectives,
        createEmptyObjective(),
      ],
    };
    onValueChange('weeks', weeks);
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-2xl font-bold text-primary">
            Planificación Semanal
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <Button onClick={addWeek}>
            Agregar Nueva Semana
          </Button>

          {/* TABLE HEADER */}
          <div className="grid grid-cols-[90px_240px_1fr_140px] bg-gray-100 text-sm font-semibold border rounded-t-lg">
            <div className="p-3">N° SEM.</div>
            <div className="p-3">ÁREA DE TRABAJO</div>
            <div className="p-3">DETALLE DE OBJETIVOS Y SEGUIMIENTO</div>
            <div className="p-3 text-center">ACCIONES</div>
          </div>

          {/* WEEKS */}
          {Array.isArray(formState.weeks) &&
            formState.weeks.map((week: any, wIndex: number) => (
              <div
                key={wIndex}
                className="border border-t-0 rounded-b-lg"
              >
                {/* ROW */}
                <div className="grid grid-cols-[90px_240px_1fr_140px] items-center p-3 border-b">
                  <input
                    type="number"
                    value={week.weekNumber}
                    disabled
                    className="border rounded px-2 py-1 w-16"
                  />

                  <InputCustom
                    name={`weeks.${wIndex}.areaTrabajo`}
                    value={week.areaTrabajo}
                    disabled={week.locked}
                    placeholder="Ej: Lenguaje, Motricidad fina..."
                    onChange={(e) =>
                      onValueChange(
                        `weeks.${wIndex}.areaTrabajo`,
                        e.target.value
                      )
                    }
                  />

                  <span className="italic text-gray-400">
                    Añadir objetivo...
                  </span>

                  <div className="flex items-center gap-3 justify-center">
                    <button onClick={() => toggleExpand(wIndex)}>
                      {week.expanded ? <ChevronUp /> : <ChevronDown />}
                    </button>

                    <button onClick={() => addObjective(wIndex)}>
                      <Plus className="text-green-600" />
                    </button>

                    <button onClick={() => toggleLock(wIndex)}>
                      <Lock
                        className={
                          week.locked
                            ? 'text-red-500'
                            : 'text-gray-400'
                        }
                      />
                    </button>
                  </div>
                </div>

                {/* ACCORDION */}
                {week.expanded && (
                  <div className="bg-white p-6 space-y-6">
                    {week.objectives.map(
                      (obj: any, oIndex: number) => (
                        <div
                          key={oIndex}
                          className="border rounded-lg p-4 space-y-4"
                        >
                          <InputCustom
                            multiline
                            label="Objetivo Específico (SMART)"
                            name={`weeks.${wIndex}.objectives.${oIndex}.smart`}
                            value={obj.smart}
                            disabled={week.locked}
                            onChange={(e) =>
                              onValueChange(
                                `weeks.${wIndex}.objectives.${oIndex}.smart`,
                                e.target.value
                              )
                            }
                          />

                          <InputCustom
                            multiline
                            label="Material / Recursos"
                            name={`weeks.${wIndex}.objectives.${oIndex}.resources`}
                            value={obj.resources}
                            disabled={week.locked}
                            onChange={(e) =>
                              onValueChange(
                                `weeks.${wIndex}.objectives.${oIndex}.resources`,
                                e.target.value
                              )
                            }
                          />

                          <SelectCustom
                            label="Estado del Logro"
                            options={[
                              { id: 'no-adquirido', value: 'No Adquirido' },
                              { id: 'en-proceso', value: 'En Proceso' },
                              { id: 'adquirido', value: 'Adquirido' },
                            ]}
                            selected={
                              obj.status
                                ? { id: obj.status, value: obj.status }
                                : null
                            }
                            onSelect={(v) =>
                              v &&
                              !Array.isArray(v) &&
                              onValueChange(
                                `weeks.${wIndex}.objectives.${oIndex}.status`,
                                v.id
                              )
                            }
                          />

                          <InputCustom
                            type="date"
                            label="Fecha de Adquisición"
                            name={`weeks.${wIndex}.objectives.${oIndex}.date`}
                            value={obj.date}
                            disabled={week.locked}
                            onChange={(e) =>
                              onValueChange(
                                `weeks.${wIndex}.objectives.${oIndex}.date`,
                                e.target.value
                              )
                            }
                          />

                          <InputCustom
                            multiline
                            label="Observaciones / Evidencias Clave"
                            name={`weeks.${wIndex}.objectives.${oIndex}.observations`}
                            value={obj.observations}
                            disabled={week.locked}
                            onChange={(e) =>
                              onValueChange(
                                `weeks.${wIndex}.objectives.${oIndex}.observations`,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
