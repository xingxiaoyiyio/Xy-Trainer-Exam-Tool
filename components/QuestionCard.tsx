
import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean, selected: string) => void;
  showExplanation?: boolean;
  userAnswer?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, showExplanation: alwaysShowExpl, userAnswer: propUserAnswer }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Reset state when question changes
    setSelected(propUserAnswer ? (question.type === '多选题' ? propUserAnswer.split(',') : [propUserAnswer]) : []);
    setIsSubmitted(!!propUserAnswer);
  }, [question.question_id, propUserAnswer]);

  const handleOptionClick = (optionKey: string) => {
    if (isSubmitted) return;

    if (question.type === '多选题') {
      setSelected(prev => 
        prev.includes(optionKey) ? prev.filter(k => k !== optionKey) : [...prev, optionKey]
      );
    } else {
      setSelected([optionKey]);
      const isCorrect = optionKey === question.answer;
      setIsSubmitted(true);
      onAnswer(isCorrect, optionKey);
    }
  };

  const handleMultiSubmit = () => {
    if (selected.length === 0 || isSubmitted) return;
    const sortedSelected = [...selected].sort().join(', ');
    const isCorrect = sortedSelected === question.answer;
    setIsSubmitted(true);
    onAnswer(isCorrect, sortedSelected);
  };

  const getOptionLabel = (option: string) => option.charAt(0);

  const getOptionStyle = (optionKey: string) => {
    if (!isSubmitted) {
      return selected.includes(optionKey) 
        ? 'bg-indigo-600 text-white border-indigo-600' 
        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300';
    }

    const isCorrectAnswer = question.answer.includes(optionKey);
    const isUserSelected = selected.includes(optionKey);

    if (isCorrectAnswer) return 'bg-green-500 text-white border-green-500';
    if (isUserSelected && !isCorrectAnswer) return 'bg-red-500 text-white border-red-500';
    return 'bg-slate-50 text-slate-400 border-slate-100 opacity-60';
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-indigo-50/50 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${
          question.type === '单选题' ? 'bg-blue-100 text-blue-600' : 
          question.type === '多选题' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'
        }`}>
          {question.type === 'true_false' ? '判断题' : question.type}
        </span>
        <span className="text-slate-300 text-sm font-medium">ID: {question.question_id}</span>
      </div>

      <h3 className="text-lg font-bold leading-relaxed text-slate-800">
        {question.question}
      </h3>

      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const key = getOptionLabel(option);
          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(key)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group ${getOptionStyle(key)}`}
            >
              <span className="text-sm font-medium flex-1 pr-4">{option}</span>
              {isSubmitted && question.answer.includes(key) && <CheckCircle2 size={18} className="text-white shrink-0" />}
              {isSubmitted && selected.includes(key) && !question.answer.includes(key) && <XCircle size={18} className="text-white shrink-0" />}
            </button>
          );
        })}
      </div>

      {question.type === '多选题' && !isSubmitted && (
        <button
          onClick={handleMultiSubmit}
          disabled={selected.length === 0}
          className="w-full tech-gradient text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-50 transition-all"
        >
          确定提交
        </button>
      )}

      {(isSubmitted || alwaysShowExpl) && (
        <div className="mt-8 p-5 bg-slate-50 rounded-2xl border-l-4 border-indigo-400 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="flex items-center gap-2 mb-2 text-indigo-600">
            <Info size={18} />
            <span className="text-sm font-black tracking-tight">解析</span>
          </div>
          <p className="text-xs font-bold text-slate-500 mb-2">
            正确答案: <span className="text-green-600 font-black">{question.answer}</span>
          </p>
          <p className="text-sm text-slate-600 leading-relaxed italic">
            {question.explanation || "该题目暂无详细解析。"}
          </p>
        </div>
      )}
    </div>
  );
};
