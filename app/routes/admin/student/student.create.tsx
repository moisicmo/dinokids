import { useEffect, useState, type FormEvent } from 'react';
import { useForm, useTutorStore } from '@/hooks';
import { Button, DateTimePickerCustom, DrawerCustom, InputCustom, SelectCustom, UserFormFields, type ValueSelect } from '@/components';
import { type TutorModel, Gender, EducationLevel, formStudentValidations, formStudentInit, type StudentModel, type StudentRequest } from '@/models';
import { TutorCreate } from '../tutor/tutor.create';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: StudentModel | null;
  onCreate: (body: StudentRequest) => void;
  onUpdate: (id: string, body: StudentRequest) => void;
  variant?: 'modal' | 'drawer';
}


export const StudentCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
    onCreate,
    onUpdate,
    variant = 'modal',
  } = props;
  const { dataTutor, getTutors, createTutor } = useTutorStore();


  const {
    user,
    birthdate,
    gender,
    school,
    grade,
    educationLevel,
    tutors,
    onInputChange,
    onResetForm,
    isFormValid,
    onValueChange,
    userValid,
    birthdateValid,
    genderValid,
    schoolValid,
    gradeValid,
    educationLevelValid,
    tutorsValid,
  } = useForm(item ?? formStudentInit, formStudentValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showTutorModal, setShowTutorModal] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await onCreate({
        numberDocument: user.numberDocument.trim() == ''? null :user.numberDocument.trim(),
        typeDocument: 'DNI',
        name: user.name.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim() == ''? null: user.email.trim(),
        phone: [],
        birthdate,
        gender,
        school: school.name.trim(),
        grade: parseInt(grade),
        educationLevel,
        tutorIds: tutors.map((tutor: TutorModel) => tutor.userId),
        numberCard: user.numberCard.trim() == ''? null: user.numberCard.trim(),
      });
    } else {
      await onUpdate(item.userId, {
        numberDocument: user.numberDocument.trim() == ''? null :user.numberDocument.trim(),
        typeDocument: 'DNI',
        name: user.name.trim(),
        lastName: user.lastName.trim(),
        email: user.email.trim() == ''? null: user.email.trim(),
        phone: [],
        birthdate,
        gender,
        school: school.name.trim(),
        grade: parseInt(grade),
        educationLevel,
        tutorIds: tutors.map((tutor: TutorModel) => tutor.userId),
        numberCard: user.numberCard.trim() == ''? null: user.numberCard.trim(),
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

  useEffect(() => {
    getTutors();
  }, [])

  if (!open) return null;

  const maxBirthdate = new Date();
  maxBirthdate.setFullYear(maxBirthdate.getFullYear() - 2);

  const genderOptions: ValueSelect[] = Object.entries(Gender).map(
    ([key, value]) => ({
      id: key,
      value,
    })
  );

  const educationLevelOptions: ValueSelect[] = Object.entries(EducationLevel).map(
    ([key, value]) => ({
      id: key,
      value,
    })
  );


  const formContent = (
    <form onSubmit={sendSubmit} className="space-y-4">
      <div className="space-y-1">
        <SelectCustom
          multiple
          label="Tutores"
          options={dataTutor.data?.map((tutor) => ({ id: tutor.userId, value: `${tutor.user.name} ${tutor.user.lastName}` })) ?? []}
          selected={tutors.map((tutor: TutorModel) => ({ id: tutor.userId, value: `${tutor.user.name} ${tutor.user.lastName}` }))}
          onSelect={(values) => {
            if (Array.isArray(values)) {
              const select = dataTutor.data?.filter((r) =>
                values.some((v) => v.id === r.userId)
              ) ?? [];
              onValueChange('tutors', select);
            }
          }}
          error={!!tutorsValid && formSubmitted}
          helperText={formSubmitted ? tutorsValid : ''}
        />
        <button
          type="button"
          onClick={() => setShowTutorModal(true)}
          className="text-sm text-primary hover:underline"
        >
          + Crear nuevo tutor
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <UserFormFields
          user={user}
          userValid={userValid}
          formSubmitted={formSubmitted}
          onInputChange={onInputChange}
          onValueChange={onValueChange}
        />
        <DateTimePickerCustom
          name="birthdate"
          label="Fecha de nacimiento"
          mode="date"
          value={birthdate}
          maxDate={maxBirthdate}
          onChange={(val) => onValueChange('birthdate', val)}
          error={!!birthdateValid && formSubmitted}
          helperText={formSubmitted ? birthdateValid : ''}
        />
        <SelectCustom
          label="Género"
          options={genderOptions}
          selected={
            gender
              ? genderOptions.find((opt) => opt.id === gender) ?? null
              : null
          }
          onSelect={(value) => {
            if (value && !Array.isArray(value)) {
              onValueChange('gender', value.id as Gender);
            }
          }}
          error={!!genderValid && formSubmitted}
          helperText={formSubmitted ? genderValid : ''}
        />
        <InputCustom
          name="school.name"
          value={school.name}
          label="Colegio"
          onChange={onInputChange}
          error={!!schoolValid?.nameValid && formSubmitted}
          helperText={formSubmitted ? schoolValid?.nameValid : ''}
        />
        <InputCustom
          name="grade"
          value={grade}
          label="Curso"
          onChange={onInputChange}
          error={!!gradeValid && formSubmitted}
          helperText={formSubmitted ? gradeValid : ''}
        />
        <SelectCustom
          label="Nivél"
          options={educationLevelOptions}
          selected={
            educationLevel
              ? educationLevelOptions.find((opt) => opt.id === educationLevel) ?? null
              : null
          }
          onSelect={(value) => {
            if (value && !Array.isArray(value)) {
              onValueChange('educationLevel', value.id as EducationLevel);
            }
          }}
          error={!!educationLevelValid && formSubmitted}
          helperText={formSubmitted ? educationLevelValid : ''}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          onClick={() => {
            onResetForm();
            handleClose();
          }}
          color='bg-gray-400'
        >
          Cancelar
        </Button>
        <Button type='submit'>
          {item ? 'Editar' : 'Crear'}
        </Button>
      </div>
    </form>
  );

  return (
    <>
    {variant === 'drawer' ? (
      <DrawerCustom
        open={open}
        onClose={handleClose}
        title={item ? `Editar ${item.user.name}` : 'Nuevo Estudiante'}
      >
        {formContent}
      </DrawerCustom>
    ) : (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
          <h2 className="text-xl font-bold mb-4">
            {item ? `Editar ${item.user.name}` : 'Nuevo Estudiante'}
          </h2>
          {formContent}
        </div>
      </div>
    )}

    {showTutorModal && (
      <TutorCreate
        handleClose={() => setShowTutorModal(false)}
        item={null}
        onCreate={createTutor}
        onUpdate={async () => {}}
        variant="drawer"
      />
    )}
    </>
  );
};