
import React, { useState, useMemo } from 'react';
import { Question, UserStats } from '../types';
import { QuestionCard } from './QuestionCard';
import { Shuffle } from 'lucide-react';

interface RandomProps {
  questions: Question[];
  onUpdateStats: (isCorrect: boolean, questionId: string) => void;
  onToggleFavorite?: (questionId: string) => void;
  stats: UserStats;
}

export const RandomPractice: React.FC<RandomProps> = ({ questions, onUpdateStats, onToggleFavorite, stats }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  
  const shuffled = useMemo(() => 
    [...questions].sort(() => 0.5 - Math.random())
  , [questions]);

  const handleNext = () => {
    setCurrentIdx(prev => (prev + 1) % shuffled.length);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-black text-purple-600 flex items-center gap-2">
            <Shuffle size={20}/>
            随机抽题
        </h2>
      </div>

      <QuestionCard 
        question={shuffled[currentIdx]} 
        onAnswer={(isCorrect) => onUpdateStats(isCorrect, shuffled[currentIdx].question_id)}
        isFavorited={stats.favoriteQuestionIds.includes(shuffled[currentIdx].question_id)}
        onToggleFavorite={onToggleFavorite}
      />

      <button
        onClick={handleNext}
        className="w-full tech-gradient text-white py-5 rounded-3xl font-black shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
      >
        <Shuffle size={20} />
        换一题
      </button>
    </div>
  );
};
