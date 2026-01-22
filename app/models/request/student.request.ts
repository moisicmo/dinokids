import { EducationLevel, Gender, type FormUserModel, type FormUserValidations, type TutorModel, type UserRequest } from "..";

export interface StudentRequest extends UserRequest {
  birthdate: Date;
  gender: Gender;
  school?: string | null;
  grade?: number | null;
  educationLevel?: EducationLevel | null;
  tutorIds: string[];
  sessionTrackings?: JSON;
  weeklyPlannings?: JSON;
  evaluationPlannings?: JSON;
}

export interface FormStudentModel {
  user: FormUserModel,
  birthdate: Date | null;
  gender: Gender | null;
  school: {
    name: string | null;
  };
  grade: number | null;
  educationLevel: EducationLevel | null;
  tutors: TutorModel[];
}
export const formStudentInit: FormStudentModel = {
  user: {
    numberDocument: '',
    name: '',
    lastName: '',
    email: '',
    numberCard: '',
  },
  birthdate: null,
  gender: null,
  school: {
    name: '',
  },
  grade: null,
  educationLevel: null,
  tutors: [],
};

export interface FormStudentValidations {
  user: FormUserValidations;
  birthdate: [(value: Date) => boolean, string];
  gender: [(value: Gender) => boolean, string];
  school?: {
    name: [(value: string) => boolean, string];
  },
  grade?: [(value: number) => boolean, string];
  educationLevel?: [(value: EducationLevel) => boolean, string];
  tutors: [(value: TutorModel[]) => boolean, string];
}

export const formStudentValidations: FormStudentValidations = {
  user: {
    name: [(value) => value.length > 0, 'Debe ingresar el nombre'],
    lastName: [(value) => value.length > 0, 'Debe ingresar el apellido'],
  },
  birthdate: [(value) => value != null, 'Debe ingresar la fecha de nacimiento'],
  gender: [(value) => value != null, 'Debe ingresar el género'],
  tutors: [(value) => value.length > 0, 'Debe ingresar al menos un tutor'],
};

export interface SessionTracking {
  date: string | Date;  // ← Cambia esto para aceptar ambos
  area: string;
  activities: string;
  observations: string;
}

export interface SessionTrackingForm {
  sessions: {
    date: string | Date;  // ← Aquí también
    area: string;
    activities: string;
    observations: string;
  }[];
}

export const formSessionTrackingInit: SessionTrackingForm = {
  sessions: [
    {
      date: '',
      area: '',
      activities: '',
      observations: '',
    },
  ],
};

export const formSessionTrackingValidations = {
  sessions: [
    (sessions: SessionTracking[]) => {
      const result = Array.isArray(sessions) &&
        sessions.length > 0 &&
        sessions.every(
          (s) => {
            // Ahora sí puede ser Date o string
            const hasValidDate = s.date instanceof Date || 
                                (typeof s.date === 'string' && s.date.length > 0);
            
            return hasValidDate &&
                   s.area?.trim()?.length > 0 &&
                   s.activities?.trim()?.length > 0;
          }
        );
      return result;
    },
    'Debe completar todas las sesiones',
  ]
};





export interface WeeklyPlanningObjective {
  smartObjective: string;
  materials: string;
  achievementStatus: '' | 'no-adquirido' | 'en-proceso' | 'adquirido';
  acquisitionDate: string; // ISO string
  observations: string;
}

export interface WeeklyPlanningWeek {
  weekNumber: number;
  workArea: string;
  objectives: WeeklyPlanningObjective[];
  completed: boolean;
}

export interface WeeklyPlanningForm {
  weeks: WeeklyPlanningWeek[];
}

export const formWeeklyPlanningInit: WeeklyPlanningForm = {
  weeks: [
    {
      weekNumber: 1,
      workArea: '',
      objectives: [
        {
          smartObjective: '',
          materials: '',
          achievementStatus: '',
          acquisitionDate: '',
          observations: '',
        },
      ],
      completed: false,
    },
  ],
};

export const formWeeklyPlanningValidations = {
  weeks: [
    (weeks: WeeklyPlanningWeek[]) => {
      const result = Array.isArray(weeks) &&
        weeks.length > 0 &&
        weeks.every((week) => {
          const hasWorkArea = week.workArea?.trim()?.length > 0;
          const hasValidObjectives = week.objectives.length > 0 &&
            week.objectives.every(
              (obj) => obj.smartObjective?.trim()?.length > 0
            );
          return hasWorkArea && hasValidObjectives;
        });
      return result;
    },
    'Debe completar todas las semanas con al menos un objetivo',
  ]
};








export interface RelevantIndicator {
  area: string;
  indicator: string;
  comment: string;
}

export interface InterventionPoint {
  area: string;
  indicator: string;
  detail: string;
}

export interface ObjectiveByArea {
  area: string;
  objective: string;
}

export interface EvaluationPlanning {
  date: string | Date;
  relevantIndicators: RelevantIndicator[];
  interventionPoints: InterventionPoint[];
  objectives: ObjectiveByArea[];
}

export interface EvaluationPlanningForm {
  evaluations: EvaluationPlanning[];
}

export const formEvaluationPlanningInit: EvaluationPlanningForm = {
  evaluations: [
    {
      date: '',
      relevantIndicators: [
        { area: '', indicator: '', comment: '' },
      ],
      interventionPoints: [
        { area: '', indicator: '', detail: '' },
      ],
      objectives: [
        { area: '', objective: '' },
      ],
    },
  ],
};
export const formEvaluationPlanningValidations = {
  evaluations: [
    (evaluations: EvaluationPlanning[]) => {
      return (
        Array.isArray(evaluations) &&
        evaluations.length > 0 &&
        evaluations.every((e) => {
          const hasValidDate =
            e.date instanceof Date ||
            (typeof e.date === 'string' && e.date.length > 0);

          const indicatorsValid = e.relevantIndicators.every(
            (i) => i.area && i.indicator
          );

          const interventionsValid = e.interventionPoints.every(
            (i) => i.area && i.indicator && i.detail
          );

          const objectivesValid = e.objectives.every(
            (o) => o.area && o.objective
          );

          return (
            hasValidDate &&
            indicatorsValid &&
            interventionsValid &&
            objectivesValid
          );
        })
      );
    },
    'Debe completar correctamente todas las evaluaciones',
  ],
};
