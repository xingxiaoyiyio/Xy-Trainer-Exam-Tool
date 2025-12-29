
import React, { useState, useMemo } from 'react';
import { Question, UserStats } from '../types';
import { QuestionCard } from './QuestionCard';
import { ChevronLeft, ChevronRight, Ghost, Grid3X3, X } from 'lucide-react';

interface WrongQuestionsProps {
  allQuestions: Question[];
  wrongIds: string[];
  onUpdateStats: (isCorrect: boolean, questionId: string) => void;
  onToggleFavorite?: (questionId: string) => void;
  stats: UserStats;
}

export const WrongQuestions: React.FC<WrongQuestionsProps> = ({ allQuestions, wrongIds, onUpdateStats, onToggleFavorite, stats }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showAnswerCard, setShowAnswerCard] = useState<boolean>(false);

  const filtered = useMemo(() => 
    allQuestions.filter(q => wrongIds.includes(q.question_id))
  , [allQuestions, wrongIds]);

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-24 h-24 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center">
          <Ghost size={48} />
        </div>
        <h2 className="text-xl font-black text-slate-800">清空错题集了！</h2>
        <p className="text-slate-400 text-sm">目前的复习状态非常完美，继续保持。</p>
      </div>
    );
  }

  const currentQuestion = filtered[currentIdx];

  const handleNext = () => {
    if (currentIdx < filtered.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    onUpdateStats(isCorrect, currentQuestion.question_id);
    // If correct, the stats update will trigger a re-filter and potentially remove this item.
    // The component will re-render with a new 'filtered' list.
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentIdx(index);
    setShowAnswerCard(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-black text-red-500">错题强化练习</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-slate-400">
            {currentIdx + 1} / {filtered.length}
          </span>
          <button
            onClick={() => setShowAnswerCard(true)}
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            title="答题卡"
          >
            <Grid3X3 size={16} className="text-slate-600" />
          </button>
        </div>
      </div>

      <QuestionCard 
        question={currentQuestion} 
        onAnswer={handleAnswer}
        isFavorited={stats.favoriteQuestionIds.includes(currentQuestion.question_id)}
        onToggleFavorite={onToggleFavorite}
      />

      <div className="flex gap-4">
        <button
          disabled={currentIdx === 0}
          onClick={handlePrev}
          className="flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold disabled:opacity-30"
        >
          上一题
        </button>
        <button
          disabled={currentIdx === filtered.length - 1}
          onClick={handleNext}
          className="flex-1 tech-gradient text-white py-4 rounded-2xl font-bold disabled:opacity-30"
        >
          下一题
        </button>
      </div>

      {/* Answer Card Modal */}
      {showAnswerCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-800">错题答题卡</h3>
              <button
                onClick={() => setShowAnswerCard(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {filtered.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleJumpToQuestion(index)}
                  className={`aspect-square rounded-xl font-bold text-sm transition-all ${
                    index === currentIdx
                      ? 'bg-red-500 text-white shadow-lg scale-110'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
