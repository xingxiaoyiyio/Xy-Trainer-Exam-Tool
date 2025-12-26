
export const EXAM_CONFIG = {
  TOTAL_QUESTIONS: 190,
  TIME_LIMIT: 90 * 60, // 90 minutes in seconds
  DISTRIBUTION: {
    'true_false': 40,
    '单选题': 140,
    '多选题': 10
  },
  SCORING: {
    'true_false': 0.5,
    '单选题': 0.5,
    '多选题': 1.0
  }
};

export const STORAGE_KEYS = {
  STATS: 'ai_trainer_stats',
  EXAM: 'ai_trainer_exam_state'
};
