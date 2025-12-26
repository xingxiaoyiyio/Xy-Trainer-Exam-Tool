
export type QuestionType = '单选题' | '多选题' | 'true_false' | '判断题';

export interface Question {
  question_id: string;
  type: QuestionType;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface UserStats {
  totalAnswered: number;
  correctCount: number;
  wrongQuestionIds: string[];
  practiceProgress: Record<string, number>; // type -> index
}

export interface ExamState {
  isActive: boolean;
  questions: Question[];
  userAnswers: Record<number, string>;
  timeRemaining: number; // in seconds
  startTime: number;
}
