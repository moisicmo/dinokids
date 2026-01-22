import { useState, useMemo, type FormEvent } from 'react';
import { Button, DateTimePickerCustom, InputCustom } from '@/components';
import { useForm } from '@/hooks';
import {
  formSessionTrackingInit,
  formSessionTrackingValidations,
  type SessionTrackingForm,
  type StudentModel,
  type StudentRequest,
  type TutorModel,
} from '@/models';

interface Props {
  student: StudentModel;
  onClose: () => void;
  onUpdate: (id: string, body: StudentRequest) => void;
}

export const SessionTrackingModal = ({
  student,
  onClose,
  onUpdate,
}: Props) => {

  // Memoizar initialForm para evitar recrearlo en cada render
  const initialForm = useMemo<SessionTrackingForm>(() => {
    return student.sessionTrackings && Array.isArray(student.sessionTrackings)
      ? { sessions: student.sessionTrackings }
      : formSessionTrackingInit;
  }, [student.sessionTrackings]);

  const {
    sessions,
    formState,
    onValueChange,
    onResetForm,
    isFormValid,
    sessionsValid,
  } = useForm(initialForm, formSessionTrackingValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  // Memoizar las fechas convertidas a Date
  const sessionDates = useMemo(() => {
    return sessions.map((session:any) => {
      // Si es string, convertir a Date
      if (typeof session.date === 'string' && session.date) {
        return new Date(session.date);
      }
      // Si ya es Date, dejarlo tal cual
      return session.date;
    });
  }, [sessions]);

  const updateSession = (index: number, field: string, value: any) => {
    const updated = sessions.map((s: any, i: number) => {
      if (i !== index) return s;
      
      // Si el campo es date y el valor es un Date, convertirlo a string ISO
      if (field === 'date' && value instanceof Date) {
        return { ...s, [field]: value.toISOString() };
      }
      
      return { ...s, [field]: value };
    });
    
    onValueChange('sessions', updated);
  };

  const addRow = () => {
    onValueChange('sessions', [
      ...sessions,
      { date: '', area: '', activities: '', observations: '' },
    ]);
  };

  const removeRow = (index: number) => {
    onValueChange(
      'sessions',
      sessions.filter((_: any, i: number) => i !== index)
    );
  };

  const sendSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    console.log('Sessions:', sessions);
    console.log('Is form valid:', isFormValid);
    
    if (!isFormValid) return;

    await onUpdate(student.userId, {
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
      sessionTrackings: formState.sessions,
      weeklyPlannings: student.weeklyPlannings,
      evaluationPlannings: student.evaluationPlannings,
    });

    onResetForm();
    onClose();
  };
  
  const hasSessionError = !!sessionsValid && formSubmitted;
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            Seguimiento de Sesiones
          </h2>

          <form onSubmit={sendSubmit} className="space-y-4">
            {sessions.map((session: any, index: number) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-5 gap-2 border p-3 rounded"
              >
                <DateTimePickerCustom
                  mode="date"
                  name={`sessions.${index}.date`}
                  label="Fecha"
                  value={sessionDates[index]}
                  onChange={(val) =>
                    updateSession(index, 'date', val)
                  }
                  error={hasSessionError && !session.date}
                  helperText={
                    hasSessionError && !session.date
                      ? 'Campo obligatorio'
                      : ''
                  }
                />

                <InputCustom
                  multiline
                  name={`sessions.${index}.area`}
                  label="Área trabajada"
                  value={session.area}
                  onChange={(e) =>
                    updateSession(index, 'area', e.target.value)
                  }
                  error={hasSessionError && !session.area}
                  helperText={
                    hasSessionError && !session.area
                      ? 'Campo obligatorio'
                      : ''
                  }
                />

                <InputCustom
                  multiline
                  name={`sessions.${index}.activities`}
                  label="Actividades"
                  value={session.activities}
                  onChange={(e) =>
                    updateSession(index, 'activities', e.target.value)
                  }
                  error={hasSessionError && !session.activities}
                  helperText={
                    hasSessionError && !session.activities
                      ? 'Campo obligatorio'
                      : ''
                  }
                />

                <InputCustom
                  multiline
                  name={`sessions.${index}.observations`}
                  label="Observaciones"
                  value={session.observations}
                  onChange={(e) =>
                    updateSession(index, 'observations', e.target.value)
                  }
                  error={hasSessionError && !session.observations}
                  helperText={
                    hasSessionError && !session.observations
                      ? 'Campo obligatorio'
                      : ''
                  }
                />

                <div className="flex items-center justify-center">
                  <Button
                    type="button"
                    color="bg-red-400"
                    onClick={() => removeRow(index)}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            ))}

            <Button
              type="button"
              onClick={addRow}
              color="bg-blue-500"
            >
              + Agregar sesión
            </Button>

            <div className="flex justify-end gap-2 pt-4">
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
              <Button type="submit">
                Guardar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};