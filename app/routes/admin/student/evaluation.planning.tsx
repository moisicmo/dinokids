import { useMemo, useState, type FormEvent } from 'react';
import { Button, DateTimePickerCustom, InputCustom } from '@/components';
import { useForm } from '@/hooks';

import {
  formEvaluationPlanningInit,
  formEvaluationPlanningValidations,
  type EvaluationPlanningForm,
  type StudentModel,
  type StudentRequest,
  type TutorModel,
} from '@/models';

interface Props {
  student: StudentModel;
  onClose: () => void;
  onUpdate: (id: string, body: StudentRequest) => void;
}

export const EvaluationPlanningModal = ({
  student,
  onClose,
  onUpdate,
}: Props) => {

  const initialForm = useMemo<EvaluationPlanningForm>(() => {
    if (student.evaluationPlannings && Array.isArray(student.evaluationPlannings)) {
      // Convertir las fechas de string a Date si vienen del backend
      const evaluations = student.evaluationPlannings.map(evaluation => ({
        ...evaluation,
        date: evaluation.date ? new Date(evaluation.date) : ''
      }));
      return { evaluations };
    }
    return formEvaluationPlanningInit;
  }, [student.evaluationPlannings]);

  const {
    evaluations,
    formState,
    onValueChange,
    onResetForm,
    isFormValid,
  } = useForm(initialForm, formEvaluationPlanningValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  const toggleAccordion = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const updateEvaluation = (
    evalIndex: number,
    field: string,
    value: any
  ) => {
    const updated = evaluations.map((e: any, i: any) =>
      i === evalIndex ? { ...e, [field]: value } : e
    );
    onValueChange('evaluations', updated);
  };

  const addEvaluation = () => {
    const newEvaluation = {
      date: '',
      relevantIndicators: [{ area: '', indicator: '', comment: '' }],
      interventionPoints: [{ area: '', indicator: '', detail: '' }],
      objectives: [{ area: '', objective: '' }],
    };
    onValueChange('evaluations', [...evaluations, newEvaluation]);
    setOpenIndexes((prev) => [...prev, evaluations.length]);
  };

  const sendSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (!isFormValid) return;

    // Convertir las fechas a formato ISO string para enviar al backend
    const formattedEvaluations = formState.evaluations.map((evaluation:any) => ({
      ...evaluation,
      date: evaluation.date instanceof Date 
        ? evaluation.date.toISOString() 
        : evaluation.date
    }));

    onUpdate(student.userId, {
      numberDocument: student.user?.numberDocument,
      typeDocument: 'DNI',
      name: student.user.name,
      lastName: `${student.user?.lastName}`,
      email: student.user.email,
      phone: [],
      birthdate: student.birthdate,
      gender: student.gender,
      school: student.school?.name,
      grade: student.grade,
      educationLevel: student.educationLevel,
      tutorIds: student.tutors.map((tutor: TutorModel) => tutor.userId),
      numberCard: student.user.numberCard,
      sessionTrackings: student.sessionTrackings,
      weeklyPlannings: student.weeklyPlannings,
      evaluationPlannings: formattedEvaluations, // Usar las evaluaciones formateadas
    });

    onResetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={sendSubmit} className="p-6 space-y-4">

          {evaluations.map((evaluation: any, index: number) => (
            <div key={index} className="border rounded mb-4">
              <div
                className="flex justify-between items-center p-3 cursor-pointer"
                onClick={() => toggleAccordion(index)}
              >
                <h3 className="font-semibold">
                  {index === 0 ? 'Evaluación Completa' : 'Reevaluación'}
                </h3>
                <span>{openIndexes.includes(index) ? '–' : '+'}</span>
              </div>

              {openIndexes.includes(index) && (
                <div className="p-4 space-y-4">

                  {/* Fecha de evaluación */}
                  <DateTimePickerCustom
                    mode="date"
                    name={`evaluations[${index}].date`}
                    label="Fecha de evaluación"
                    // Asegurar que el valor sea un Date válido o string vacío
                    value={evaluation.date instanceof Date || evaluation.date === '' 
                      ? evaluation.date 
                      : evaluation.date ? new Date(evaluation.date) : ''}
                    onChange={(val) => updateEvaluation(index, 'date', val)}
                  />

                  {/* Resto del código permanece igual */}
                  {/* Indicadores relevantes */}
                  <div>
                    <h4 className="font-semibold mb-2">Indicadores Relevantes</h4>
                    {evaluation.relevantIndicators.map((row: any, i: number) => (
                      <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                        <InputCustom
                          multiline
                          label="Área"
                          name={`evaluations[${index}].relevantIndicators[${i}].area`}
                          value={row.area}
                          onChange={(e) => {
                            const updated = [...evaluation.relevantIndicators];
                            updated[i].area = e.target.value;
                            updateEvaluation(index, 'relevantIndicators', updated);
                          }}
                        />
                        <InputCustom
                          label="Indicador"
                          multiline
                          name={`evaluations[${index}].relevantIndicators[${i}].indicator`}
                          value={row.indicator}
                          onChange={(e) => {
                            const updated = [...evaluation.relevantIndicators];
                            updated[i].indicator = e.target.value;
                            updateEvaluation(index, 'relevantIndicators', updated);
                          }}
                        />
                        <InputCustom
                          multiline
                          label="Comentario"
                          name={`evaluations[${index}].relevantIndicators[${i}].comment`}
                          value={row.comment}
                          onChange={(e) => {
                            const updated = [...evaluation.relevantIndicators];
                            updated[i].comment = e.target.value;
                            updateEvaluation(index, 'relevantIndicators', updated);
                          }}
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => {
                        const updated = [
                          ...evaluation.relevantIndicators,
                          { area: '', indicator: '', comment: '' },
                        ];
                        updateEvaluation(index, 'relevantIndicators', updated);
                      }}
                    >
                      + Agregar indicador
                    </Button>
                  </div>

                  {/* Principales puntos de intervención */}
                  <div>
                    <h4 className="font-semibold mb-2">Principales Puntos de Intervención</h4>
                    {evaluation.interventionPoints.map((row: any, i: number) => (
                      <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                        <InputCustom
                          multiline
                          label="Área"
                          name={`evaluations[${index}].interventionPoints[${i}].area`}
                          value={row.area}
                          onChange={(e) => {
                            const updated = [...evaluation.interventionPoints];
                            updated[i].area = e.target.value;
                            updateEvaluation(index, 'interventionPoints', updated);
                          }}
                        />
                        <InputCustom
                          multiline
                          label="Indicador"
                          name={`evaluations[${index}].interventionPoints[${i}].indicator`}
                          value={row.indicator}
                          onChange={(e) => {
                            const updated = [...evaluation.interventionPoints];
                            updated[i].indicator = e.target.value;
                            updateEvaluation(index, 'interventionPoints', updated);
                          }}
                        />
                        <InputCustom
                          multiline
                          label="Detalle"
                          name={`evaluations[${index}].interventionPoints[${i}].detail`}
                          value={row.detail}
                          onChange={(e) => {
                            const updated = [...evaluation.interventionPoints];
                            updated[i].detail = e.target.value;
                            updateEvaluation(index, 'interventionPoints', updated);
                          }}
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => {
                        const updated = [
                          ...evaluation.interventionPoints,
                          { area: '', indicator: '', detail: '' },
                        ];
                        updateEvaluation(index, 'interventionPoints', updated);
                      }}
                    >
                      + Agregar punto
                    </Button>
                  </div>

                  {/* Objetivos propuestos por áreas */}
                  <div>
                    <h4 className="font-semibold mb-2">Objetivos Propuestos por Áreas</h4>
                    {evaluation.objectives.map((row: any, i: number) => (
                      <div key={i} className="grid grid-cols-2 gap-2 mb-2">
                        <InputCustom
                          multiline
                          label="Área"
                          name={`evaluations[${index}].objectives[${i}].area`}
                          value={row.area}
                          onChange={(e) => {
                            const updated = [...evaluation.objectives];
                            updated[i].area = e.target.value;
                            updateEvaluation(index, 'objectives', updated);
                          }}
                        />
                        <InputCustom
                          multiline
                          label="Objetivo"
                          name={`evaluations[${index}].objectives[${i}].objective`}
                          value={row.objective}
                          onChange={(e) => {
                            const updated = [...evaluation.objectives];
                            updated[i].objective = e.target.value;
                            updateEvaluation(index, 'objectives', updated);
                          }}
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => {
                        const updated = [
                          ...evaluation.objectives,
                          { area: '', objective: '' },
                        ];
                        updateEvaluation(index, 'objectives', updated);
                      }}
                    >
                      + Agregar objetivo
                    </Button>
                  </div>

                </div>
              )}
            </div>
          ))}

          {/* Botones finales */}
          <div className="flex justify-end gap-2">
            <Button type="button" color="bg-blue-500" onClick={addEvaluation}>
              + Agregar Evaluación
            </Button>
            <Button
              type="button"
              color="bg-gray-400"
              onClick={() => {
                onResetForm();
                onClose();
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};