
export const EXAM_CONFIG = {
  TOTAL_QUESTIONS: 100,
  TIME_LIMIT: 90 * 60, // 90 minutes in seconds
  DISTRIBUTION: {
    'true_false': 10,
    '单选题': 80,
    '多选题': 10
  },
  SCORING: {
    'true_false': 1.0,
    '单选题': 1.0,
    '多选题': 1.0
  }
};

export const STORAGE_KEYS = {
  STATS: 'ai_trainer_stats',
  EXAM: 'ai_trainer_exam_state'
};
