import { useEffect, useState, type FormEvent } from 'react';
import { useInscriptionStore, useForm, useStudentStore } from '@/hooks';
import { ButtonCustom, InputCustom, SelectCustom } from '@/components';
import { type InscriptionModel, formInscriptionInit, formInscriptionValidations } from '@/models';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: InscriptionModel | null;
}

export const InscriptionCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
  } = props;
  const { createInscription, updateInscription } = useInscriptionStore();
  const { dataStudent, getStudents } = useStudentStore();

  const {
    student,
    inscriptionPrice,
    monthPrice,
    assignmentRooms,
    onInputChange,
    onResetForm,
    isFormValid,
    onValueChange,
    studentValid,
    inscriptionPriceValid,
    monthPriceValid,
    assignmentRoomsValid,
  } = useForm(item ?? formInscriptionInit, formInscriptionValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await createInscription({
        studentId: student.userId,
        inscriptionPrice: parseFloat(inscriptionPrice),
        monthPrice: parseFloat(monthPrice),
        assignmentRooms,
      });
    } else {
      await updateInscription(item.id, {
        studentId: student.userId,
        inscriptionPrice: parseFloat(inscriptionPrice),
        monthPrice: parseFloat(monthPrice),
        assignmentRooms,
      });
    }

    handleClose();
    onResetForm();
  };

  useEffect(() => {
    if (item) {
      setFormSubmitted(false);
    }
  }, [item]);

  if (!open) return null;

  useEffect(() => {
    getStudents();
  }, [])


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {item ? 'Editar inscripción' : 'Nueva Inscripción'}
        </h2>

        <form onSubmit={sendSubmit} className="space-y-4">
          <SelectCustom
            label="Estudiante"
            options={dataStudent.data?.map((student) => ({ id: student.userId, value: student.user.name })) ?? []}
            selected={student ? { id: student.id, value: student.user.name } : null}
            onSelect={(value) => {
              if (value && !Array.isArray(value)) {
                const selected = dataStudent.data?.find((r) => r.userId === value.id);
                onValueChange('student', selected);
              }
            }}
            error={!!studentValid && formSubmitted}
            helperText={formSubmitted ? studentValid : ''}
          />
          <InputCustom
            name="inscriptionPrice"
            value={inscriptionPrice}
            label="Precio de la inscripción"
            onChange={onInputChange}
            error={!!inscriptionPriceValid && formSubmitted}
            helperText={formSubmitted ? inscriptionPriceValid : ''}
          />
          <InputCustom
            name="monthPrice"
            value={monthPrice}
            label="Precio de la mensualidad"
            onChange={onInputChange}
            error={!!monthPriceValid && formSubmitted}
            helperText={formSubmitted ? monthPriceValid : ''}
          />

          <div className="flex justify-end gap-2 pt-2">
            <ButtonCustom
              onClick={() => {
                onResetForm();
                handleClose();
              }}
              text='Cancelar'
              color='bg-gray-400'
            />
            <ButtonCustom
              type='submit'
              text={item ? 'Editar' : 'Crear'}
            />
          </div>
        </form>
      </div>
    </div>
  );
};