import { useEffect, useState, type FormEvent } from 'react';
import { useStudentStore, useForm, useTutorStore } from '@/hooks';
import { ButtonCustom, DateTimePickerCustom, InputCustom, SelectCustom, type ValueSelect } from '@/components';
import { type FormStudentModel, type FormStudentValidations, type UserModel, type TutorModel, Gender, EducationLevel } from '@/models';

interface Props {
  open: boolean;
  handleClose: () => void;
  item: any;
}

const formFields: FormStudentModel = {
  numberDocument: '',
  name: '',
  lastName: '',
  email: '',
  birthdate: null,
  gender: null,
  school: '',
  grade: 0,
  educationLevel: null,
  tutors: [],
};

const formValidations: FormStudentValidations = {
  numberDocument: [(value) => value.length >= 0, 'Debe ingresar el número de documento'],
  name: [(value) => value.length >= 0, 'Debe ingresar el nombre'],
  lastName: [(value) => value.length > 0, 'Debe ingresar el apellido'],
  email: [(value) => value.length > 0, 'Debe ingresar el correo electrónico'],
  birthdate: [(value) => value != null, 'Debe ingresar la fecha de nacimiento'],
  gender: [(value) => value != null, 'Debe ingresar el género'],
  school: [(value) => value.length > 0, 'Debe ingresar el colegio'],
  grade: [(value) => value > 0, 'Debe ingresar el grado'],
  educationLevel: [(value) => value != null, 'Debe ingresar el nivel'],
  tutors: [(value) => value.length > 0, 'Debe ingresar al menos un tutor'],
};

export const StudentCreate = (props: Props) => {
  const {
    open,
    handleClose,
    item,
  } = props;
  const { createStudent, updateStudent } = useStudentStore();
  const { dataTutor, getTutors } = useTutorStore();


  const {
    numberDocument,
    name,
    lastName,
    email,
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
    numberDocumentValid,
    nameValid,
    lastNameValid,
    emailValid,
    birthdateValid,
    genderValid,
    schoolValid,
    gradeValid,
    educationLevelValid,
    tutorsValid,
  } = useForm(item ?? formFields, formValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;

    if (item == null) {
      await createStudent({
        numberDocument,
        typeDocument: 'DNI',
        name: name.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        birthdate,
        gender,
        school: school.trim(),
        grade: parseInt(grade),
        educationLevel,
        tutorIds: tutors.map((tutor: TutorModel) => tutor.id),
      });
    } else {
      await updateStudent(item.id, {
        numberDocument,
        typeDocument: 'DNI',
        name: name.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        birthdate,
        gender,
        school: school.trim(),
        grade: parseInt(grade),
        educationLevel,
        tutorIds: tutors.map((tutor: TutorModel) => tutor.id),
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
    getTutors();
  }, [])

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


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-bold mb-4">
          {item ? `Editar ${item.name}` : 'Nuevo Estudiante'}
        </h2>

        <form onSubmit={sendSubmit} className="space-y-4">
          <SelectCustom
            multiple
            label="Tutores"
            options={dataTutor.data?.map((tutor) => ({ id: tutor.id, value: tutor.name })) ?? []}
            selected={tutors.map((s: UserModel) => ({ id: s.id, value: s.name }))}
            onSelect={(values) => {
              if (Array.isArray(values)) {
                const select = dataTutor.data?.filter((r) =>
                  values.some((v) => v.id === r.id)
                ) ?? [];
                onValueChange('tutors', select);
              }
            }}
            error={!!tutorsValid && formSubmitted}
            helperText={formSubmitted ? tutorsValid : ''}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            <InputCustom
              name="numberDocument"
              value={numberDocument}
              label="Numero de documento"
              onChange={onInputChange}
              error={!!numberDocumentValid && formSubmitted}
              helperText={formSubmitted ? numberDocumentValid : ''}
            />
            <InputCustom
              name="name"
              value={name}
              label="Nombre"
              onChange={onInputChange}
              error={!!nameValid && formSubmitted}
              helperText={formSubmitted ? nameValid : ''}
            />
            <InputCustom
              name="lastName"
              value={lastName}
              label="Apellido"
              onChange={onInputChange}
              error={!!lastNameValid && formSubmitted}
              helperText={formSubmitted ? lastNameValid : ''}
            />
            <InputCustom
              name="email"
              value={email}
              label="Correo electrónico"
              onChange={onInputChange}
              error={!!emailValid && formSubmitted}
              helperText={formSubmitted ? emailValid : ''}
            />
            <DateTimePickerCustom
              name="birthdate"
              label="Fecha de nacimiento"
              mode="date"
              value={birthdate}
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
              name="school"
              value={school}
              label="Colegio"
              onChange={onInputChange}
              error={!!schoolValid && formSubmitted}
              helperText={formSubmitted ? schoolValid : ''}
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