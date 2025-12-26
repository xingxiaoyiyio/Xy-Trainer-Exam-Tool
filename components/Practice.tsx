
import React, { useState, useMemo } from 'react';
import { Question, UserStats } from '../types';
import { QuestionCard } from './QuestionCard';
import { ChevronLeft, ChevronRight, Layers, Grid3X3, X } from 'lucide-react';

interface PracticeProps {
  questions: Question[];
  stats: UserStats;
  onUpdateStats: (isCorrect: boolean, questionId: string) => void;
  onUpdateProgress: (type: string, index: number) => void;
}

export const Practice: React.FC<PracticeProps> = ({ questions, stats, onUpdateStats, onUpdateProgress }) => {
  const [activeType, setActiveType] = useState<string>('单选题');
  const [showAnswerCard, setShowAnswerCard] = useState<boolean>(false);
  
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
        if (activeType === '判断题') return q.type === 'true_false' || q.type === '判断题';
        return q.type === activeType;
    });
  }, [activeType, questions]);

  const currentIndex = stats.practiceProgress[activeType] || 0;
  const currentQuestion = filteredQuestions[currentIndex];

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      onUpdateProgress(activeType, currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onUpdateProgress(activeType, currentIndex - 1);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    onUpdateProgress(activeType, index);
    setShowAnswerCard(false);
  };

  return (
    <div className="space-y-6">
      {/* Type Selector */}
      <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
        {['单选题', '多选题', '判断题'].map(type => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${
              activeType === type ? 'tech-gradient text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Progress Info */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-slate-400">
          <Layers size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">练习进度</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-indigo-600">
            {currentIndex + 1} / {filteredQuestions.length}
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

      {currentQuestion ? (
        <QuestionCard 
          question={currentQuestion} 
          onAnswer={(isCorrect) => onUpdateStats(isCorrect, currentQuestion.question_id)}
        />
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 shadow-sm border border-slate-100">
          暂无该类型题目
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex-1 bg-white border border-slate-200 text-slate-600 p-4 rounded-2xl flex items-center justify-center gap-2 font-bold disabled:opacity-30 active:scale-95 transition-all"
        >
          <ChevronLeft size={20} />
          上一题
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === filteredQuestions.length - 1}
          className="flex-1 tech-gradient text-white p-4 rounded-2xl flex items-center justify-center gap-2 font-bold disabled:opacity-30 active:scale-95 transition-all shadow-lg shadow-indigo-100"
        >
          下一题
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Answer Card Modal */}
      {showAnswerCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-800">答题卡</h3>
              <button
                onClick={() => setShowAnswerCard(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {filteredQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleJumpToQuestion(index)}
                  className={`aspect-square rounded-xl font-bold text-sm transition-all ${
                    index === currentIndex
                      ? 'bg-indigo-500 text-white shadow-lg scale-110'
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
