import { useEffect, useState, type FormEvent } from 'react';
import { useBookingStore, useForm } from '@/hooks';
import { ButtonCustom, InputCustom } from '@/components';
import { formBookingInscriptionInit, formBookingValidations, type FormAssignmentRoomModel, type InscriptionModel } from '@/models';
import { AssignmentRoomForm } from '../inscription';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: InscriptionModel | null;
}

export const BookingCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
  } = props;
  const { createBooking, updateBooking } = useBookingStore();

  const {
    booking,
    assignmentRooms,
    onInputChange,
    onResetForm,
    isFormValid,
    onArrayChange,
    bookingValid,
    assignmentRoomsValid,
  } = useForm(item ?? formBookingInscriptionInit, formBookingValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    const hasInvalid = assignmentRooms.some((room: FormAssignmentRoomModel) =>
      !room.room || !room.start || room.assignmentSchedules.length === 0
    );
    if (hasInvalid) return;

    if (!isFormValid) return;

    if (item == null) {
      await createBooking({
        days: parseInt(booking.days),
        dni: booking.dni.trim(),
        name: booking.name.trim(),
        amount: parseFloat(booking.amount),
        assignmentRooms: [
          ...assignmentRooms.map((assignmentRoom: FormAssignmentRoomModel) => ({
            roomId: assignmentRoom.room?.id,
            start: assignmentRoom.start,
            assignmentSchedules: assignmentRoom.assignmentSchedules

          }))
        ],
      });
    } else {
      await updateBooking(item.id, {
        days: parseInt(booking.days),
        dni: booking.dni.trim(),
        name: booking.name.trim(),
        amount: parseFloat(booking.amount),
        assignmentRooms: [
          ...assignmentRooms.map((assignmentRoom: FormAssignmentRoomModel) => ({
            roomId: assignmentRoom.room?.id,
            start: assignmentRoom.start,
            assignmentSchedules: assignmentRoom.assignmentSchedules

          }))
        ],
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


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg ${step === 2 ? 'max-w-5xl' : 'max-w-lg'} p-6 max-h-[90vh] overflow-y-auto`}>
        <h2 className="text-xl font-bold mb-4">
          {item ? 'Editar Reserva' : 'Nueva Reserva'}
        </h2>

        <form onSubmit={sendSubmit} className="space-y-4">

          <div className="flex space-x-2 mb-4">
            {
              step === 1 &&
              <div className="space-y-4">
                <InputCustom
                  name="booking.name"
                  value={booking.name}
                  label="Nombre"
                  onChange={onInputChange}
                  error={!!bookingValid?.nameValid && formSubmitted}
                  helperText={formSubmitted ? bookingValid?.nameValid : ''}
                />
                <InputCustom
                  name="booking.dni"
                  value={booking.dni}
                  label="Número de documento"
                  onChange={onInputChange}
                  error={!!bookingValid?.dniValid && formSubmitted}
                  helperText={formSubmitted ? bookingValid?.dniValid : ''}
                />
                <InputCustom
                  name="booking.amount"
                  value={booking.amount}
                  label="Monto"
                  onChange={onInputChange}
                  error={!!bookingValid?.amountValid && formSubmitted}
                  helperText={formSubmitted ? bookingValid?.amountValid : ''}
                />
                <InputCustom
                  name="booking.days"
                  value={booking.days}
                  label="Cantidad de dias"
                  onChange={onInputChange}
                  error={!!bookingValid?.daysValid && formSubmitted}
                  helperText={formSubmitted ? bookingValid?.daysValid : ''}
                />
              </div>
            }
            {
              step === 2 &&
              <AssignmentRoomForm
                assignmentRooms={assignmentRooms}
                onChange={(newAssignmentRooms) => onArrayChange('assignmentRooms', newAssignmentRooms)}
                formSubmitted={formSubmitted}
                assignmentRoomsValid={assignmentRoomsValid}
              />
            }
          </div>
          {/* Botones de acción */}
          <div className="flex justify-end gap-2 pt-4">
            <ButtonCustom
              onClick={() => {
                if (step === 1) {
                  onResetForm();
                  handleClose();
                } else {
                  setStep(step - 1);
                }
              }}
              text={step === 1 ? 'Cancelar' : 'Atrás'}
              color='bg-gray-400'
            />

            {step === 1 && (
              <ButtonCustom
                // onClick={() => setStep(2)}
                onClick={() => {
                  setFormSubmitted(true);


                  const hasError =
                    !!bookingValid?.nameValid ||
                    !!bookingValid?.dniValid ||
                    !!bookingValid?.amountValid ||
                    !!bookingValid?.daysValid;
                  ;
                  if (hasError) return;
                  setStep(2);

                }}
                text="Siguiente"
              />
            )}
            {step === 2 && (
              <ButtonCustom
                type="submit"
                text={item ? 'Editar' : 'Crear'}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};