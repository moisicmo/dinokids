type AnswerType =
  | 'text'
  | 'longtext'
  | 'datetime'
  | 'yes_no'
  | 'yes_no_comment'
  | 'scale_3'
  | 'scale_3_comment'
  | 'table';

export interface Question {
  question: string;
  typeAnswer: AnswerType;
  answer?: any;
  comment?: string;
  enableComment?: boolean;
}

export interface Evaluation {
  title: string;
  questions: Question[];
}