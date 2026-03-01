type AnswerType =
  | 'text'
  | 'longtext'
  | 'datetime'
  | 'yes_no'
  | 'yes_no_comment'
  | 'scale_3'
  | 'scale_3_comment'
  | 'table'
  | 'select';

export interface Question {
  question: string;
  typeAnswer: AnswerType;
  options?: string[];
  answer?: any;
  comment?: string;
  enableComment?: boolean;
}

export interface Evaluation {
  title: string;
  questions: Question[];
}