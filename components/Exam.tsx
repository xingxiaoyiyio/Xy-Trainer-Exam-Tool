
import React, { useEffect, useMemo, useState } from 'react';
import { Question, ExamState, UserStats } from '../types';
import { EXAM_CONFIG } from '../constants';
import { QuestionCard } from './QuestionCard';
import { Clock, Send, AlertCircle, CheckCircle } from 'lucide-react';

interface ExamProps {
  questions: Question[];
  examState: ExamState;
  setExamState: React.Dispatch<React.SetStateAction<ExamState>>;
  onUpdateStats: (isCorrect: boolean, questionId: string) => void;
  onToggleFavorite?: (questionId: string) => void;
  stats: UserStats;
}

export const Exam: React.FC<ExamProps> = ({ questions, examState, setExamState, onUpdateStats, onToggleFavorite, stats }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize Exam
  const startExam = () => {
    const drawn: Question[] = [];
    
    // Draw based on distribution
    Object.entries(EXAM_CONFIG.DISTRIBUTION).forEach(([type, count]) => {
      const pool = questions.filter(q => {
          if (type === 'true_false') return q.type === 'true_false' || q.type === '判断题';
          return q.type === type;
      });
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      drawn.push(...shuffled.slice(0, count));
    });

    setExamState({
      isActive: true,
      questions: drawn.sort(() => 0.5 - Math.random()),
      userAnswers: {},
      timeRemaining: EXAM_CONFIG.TIME_LIMIT,
      startTime: Date.now()
    });
    setCurrentIdx(0);
    setIsSubmitted(false);
  };

  // Timer Effect
  useEffect(() => {
    if (!examState.isActive || isSubmitted) return;

    const timer = setInterval(() => {
      setExamState(prev => {
        if (prev.timeRemaining <= 0) {
          clearInterval(timer);
          handleSubmit();
          return { ...prev, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examState.isActive, isSubmitted]);

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowConfirmSubmit(false);

    // Calculate final stats
    examState.questions.forEach((q, idx) => {
      const userAns = examState.userAnswers[idx];
      const isCorrect = userAns === q.answer;
      onUpdateStats(isCorrect, q.question_id);
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const onAnswer = (isCorrect: boolean, selected: string) => {
    setExamState(prev => ({
      ...prev,
      userAnswers: { ...prev.userAnswers, [currentIdx]: selected }
    }));
  };

  const calculateScore = () => {
    let score = 0;
    examState.questions.forEach((q, idx) => {
      if (examState.userAnswers[idx] === q.answer) {
        score += EXAM_CONFIG.SCORING[q.type === 'true_false' || q.type === '判断题' ? 'true_false' : q.type] || 0.5;
      }
    });
    return score;
  };

  if (!examState.isActive) {
    return (
      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 text-center space-y-6">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto text-indigo-600">
          <Clock size={40} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800">考试模式</h2>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            系统将为您抽取 {EXAM_CONFIG.TOTAL_QUESTIONS} 道题目：<br/>
            40道判断题 (0.5分/题)<br/>
            140道单选题 (0.5分/题)<br/>
            10道多选题 (1分/题)<br/>
            总计 100分，限时 90 分钟。
          </p>
        </div>
        <button
          onClick={startExam}
          className="w-full tech-gradient text-white py-5 rounded-2xl font-black shadow-lg shadow-indigo-100 active:scale-95 transition-all"
        >
          开始模拟考试
        </button>
      </div>
    );
  }

  if (isSubmitted) {
    const score = calculateScore();
    return (
      <div className="space-y-6 animate-in zoom-in duration-500">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 text-center space-y-4">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${score >= 60 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-800">{score} 分</h2>
          <p className="text-slate-500 font-bold">{score >= 60 ? '恭喜及格！' : '还需努力哦！'}</p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">总用时</p>
              <p className="text-lg font-black text-slate-700">{formatTime(EXAM_CONFIG.TIME_LIMIT - examState.timeRemaining)}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">正确数</p>
              <p className="text-lg font-black text-slate-700">
                {Object.values(examState.userAnswers).filter((v, i) => v === examState.questions[i].answer).length} / {EXAM_CONFIG.TOTAL_QUESTIONS}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setExamState(prev => ({ ...prev, isActive: false }))}
            className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold mt-4"
          >
            返回首页
          </button>
        </div>
        <div className="space-y-4">
          <h3 className="font-black text-slate-800 px-2">题目回顾</h3>
          {examState.questions.map((q, idx) => (
            <QuestionCard 
              key={idx} 
              question={q} 
              onAnswer={() => {}} 
              userAnswer={examState.userAnswers[idx]}
              showExplanation={true} 
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between sticky top-20 z-40">
        <div className="flex items-center gap-2 text-indigo-600 font-black">
          <Clock size={20} />
          <span className="text-lg tabular-nums">{formatTime(examState.timeRemaining)}</span>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">第 {currentIdx + 1} / {examState.questions.length} 题</span>
            <button 
                onClick={() => setShowConfirmSubmit(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md shadow-indigo-100"
            >
                <Send size={14} />
                交卷
            </button>
        </div>
      </div>

      <QuestionCard 
        question={examState.questions[currentIdx]} 
        onAnswer={onAnswer} 
        userAnswer={examState.userAnswers[currentIdx]}
        isFavorited={stats.favoriteQuestionIds.includes(examState.questions[currentIdx].question_id)}
        onToggleFavorite={onToggleFavorite}
      />

      <div className="flex gap-4">
        <button
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx(prev => prev - 1)}
          className="flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold disabled:opacity-30"
        >
          上一题
        </button>
        <button
          disabled={currentIdx === examState.questions.length - 1}
          onClick={() => setCurrentIdx(prev => prev + 1)}
          className="flex-1 tech-gradient text-white py-4 rounded-2xl font-bold disabled:opacity-30"
        >
          下一题
        </button>
      </div>

      {/* Answer Sheet Drawer */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h4 className="text-sm font-black mb-4 text-slate-600">答题卡</h4>
        <div className="grid grid-cols-8 gap-2">
          {examState.questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`w-full aspect-square rounded-lg text-[10px] font-black flex items-center justify-center transition-all ${
                currentIdx === idx ? 'ring-2 ring-indigo-500' : ''
              } ${
                examState.userAnswers[idx] ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-50 text-slate-300'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm text-center space-y-6">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">确认交卷？</h3>
              <p className="text-sm text-slate-500 mt-2">
                您还有 {examState.questions.length - Object.keys(examState.userAnswers).length} 道题未答。
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold"
              >
                继续答题
              </button>
              <button 
                onClick={handleSubmit}
                className="flex-1 tech-gradient text-white py-4 rounded-2xl font-bold"
              >
                确认交卷
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
