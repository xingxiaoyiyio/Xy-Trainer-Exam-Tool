
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Practice } from './components/Practice';
import { Exam } from './components/Exam';
import { WrongQuestions } from './components/WrongQuestions';
import { RandomPractice } from './components/RandomPractice';
import { Question, UserStats, ExamState } from './types';
import { RAW_QUESTIONS } from './questions_data';
import { STORAGE_KEYS } from './constants';

const App: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<'home' | 'practice' | 'exam' | 'wrong' | 'random'>('home');
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STATS);
    if (saved) {
      try {
        const parsedStats = JSON.parse(saved);
        // 确保新字段存在，如果不存在则使用默认值
        return {
          totalAnswered: parsedStats.totalAnswered || 0,
          correctCount: parsedStats.correctCount || 0,
          wrongQuestionIds: parsedStats.wrongQuestionIds || [],
          practiceProgress: parsedStats.practiceProgress || { '单选题': 0, '多选题': 0, '判断题': 0 },
          favoriteQuestionIds: parsedStats.favoriteQuestionIds || []
        };
      } catch (e) {
        console.warn('Failed to parse saved stats:', e);
      }
    }
    return {
      totalAnswered: 0,
      correctCount: 0,
      wrongQuestionIds: [],
      practiceProgress: { '单选题': 0, '多选题': 0, '判断题': 0 },
      favoriteQuestionIds: []
    };
  });

  const [examState, setExamState] = useState<ExamState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXAM);
    return saved ? JSON.parse(saved) : {
      isActive: false,
      questions: [],
      userAnswers: {},
      timeRemaining: 0,
      startTime: 0
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXAM, JSON.stringify(examState));
  }, [examState]);

  const updateStats = useCallback((isCorrect: boolean, questionId: string) => {
    setStats(prev => {
      const isAlreadyWrong = prev.wrongQuestionIds.includes(questionId);
      let newWrongIds = [...prev.wrongQuestionIds];
      
      if (!isCorrect) {
        if (!isAlreadyWrong) newWrongIds.push(questionId);
      } else {
        newWrongIds = newWrongIds.filter(id => id !== questionId);
      }

      return {
        ...prev,
        totalAnswered: prev.totalAnswered + 1,
        correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
        wrongQuestionIds: newWrongIds
      };
    });
  }, []);

  const setPracticeProgress = useCallback((type: string, index: number) => {
    setStats(prev => ({
      ...prev,
      practiceProgress: { ...prev.practiceProgress, [type]: index }
    }));
  }, []);

  const toggleFavorite = useCallback((questionId: string) => {
    setStats(prev => {
      const isFavorited = prev.favoriteQuestionIds.includes(questionId);
      const newFavoriteIds = isFavorited
        ? prev.favoriteQuestionIds.filter(id => id !== questionId)
        : [...prev.favoriteQuestionIds, questionId];
      
      return {
        ...prev,
        favoriteQuestionIds: newFavoriteIds
      };
    });
  }, []);

  return (
    <Layout currentModule={currentModule} onNavigate={setCurrentModule}>
      {currentModule === 'home' && (
        <Home stats={stats} onNavigate={setCurrentModule} onToggleFavorite={toggleFavorite} />
      )}
      {currentModule === 'practice' && (
        <Practice 
          questions={RAW_QUESTIONS} 
          stats={stats} 
          onUpdateStats={updateStats} 
          onUpdateProgress={setPracticeProgress}
          onToggleFavorite={toggleFavorite}
        />
      )}
      {currentModule === 'exam' && (
        <Exam 
          questions={RAW_QUESTIONS} 
          examState={examState} 
          setExamState={setExamState} 
          onUpdateStats={updateStats}
          stats={stats}
          onToggleFavorite={toggleFavorite}
        />
      )}
      {currentModule === 'wrong' && (
        <WrongQuestions 
          allQuestions={RAW_QUESTIONS} 
          wrongIds={stats.wrongQuestionIds} 
          onUpdateStats={updateStats}
          stats={stats}
          onToggleFavorite={toggleFavorite}
        />
      )}
      {currentModule === 'random' && (
        <RandomPractice 
          questions={RAW_QUESTIONS} 
          onUpdateStats={updateStats}
          stats={stats}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </Layout>
  );
};

export default App;
