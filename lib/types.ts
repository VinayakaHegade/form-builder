export enum QuestionType {
  ShortAnswer = 'Short answer',
  LongAnswer = 'Long answer',
  SingleSelect = 'Single select',
  Number = 'Number',
  URL = 'URL',
  Date = 'Date',
  Checkbox = 'Checkbox',
}

export interface Option {
  id: string;
  value: string;
}

export interface Checkbox {
  id: string;
  value: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  helpText?: string;
  required: boolean;
  options?: Option[];
  checkboxes?: Checkbox[];
}

export interface Form {
  id: string;
  title: string;
  questions: Question[];
  published?: boolean;
  publishedAt?: string;
}
