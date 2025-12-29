
import React from 'react';
import { UserStats } from '../types';
import { RAW_QUESTIONS } from '../questions_data';
// Fix: Added Shuffle and BookOpen to the import list from lucide-react
import { Brain, Trophy, Target, History, Sparkles, Shuffle, BookOpen, Heart } from 'lucide-react';

interface HomeProps {
  stats: UserStats;
  onNavigate: (module: 'home' | 'practice' | 'exam' | 'wrong' | 'random') => void;
  onToggleFavorite?: (questionId: string) => void;
}

export const Home: React.FC<HomeProps> = ({ stats, onNavigate, onToggleFavorite }) => {
  const accuracy = stats.totalAnswered === 0 
    ? 0 
    : Math.round((stats.correctCount / stats.totalAnswered) * 100);
  
  const progress = Math.round((stats.totalAnswered / RAW_QUESTIONS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <section className="tech-gradient rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <Sparkles className="absolute -right-4 -top-4 opacity-20 w-32 h-32" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <p className="text-indigo-100 text-sm font-medium">备考进度总览</p>
            <button
              onClick={() => onNavigate('practice')}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg flex items-center gap-2 text-xs font-medium transition-colors"
            >
              <Heart size={14} fill="currentColor" />
              <span>{stats.favoriteQuestionIds?.length || 0}</span>
            </button>
          </div>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-4xl font-extrabold">{progress}%</h2>
            <div className="text-right">
              <p className="text-xs text-indigo-100 uppercase tracking-wider">正确率</p>
              <p className="text-2xl font-bold">{accuracy}%</p>
            </div>
          </div>
          <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-4 flex justify-between text-xs font-medium text-indigo-100">
            <span>已答: {stats.totalAnswered} 题</span>
            <span>总题量: {RAW_QUESTIONS.length} 题</span>
          </div>
        </div>
      </section>

      {/* Grid Menu */}
      <div className="grid grid-cols-2 gap-4">
        <MenuCard 
          icon={<Brain className="text-blue-500" />} 
          title="顺序练习" 
          desc="逐题突破" 
          color="bg-blue-50"
          onClick={() => onNavigate('practice')}
        />
        <MenuCard 
          icon={<Trophy className="text-amber-500" />} 
          title="模拟考试" 
          desc="限时190题" 
          color="bg-amber-50"
          onClick={() => onNavigate('exam')}
        />
        <MenuCard 
          icon={<Target className="text-red-500" />} 
          title="错题重练" 
          desc={`剩余 ${stats.wrongQuestionIds.length} 题`} 
          color="bg-red-50"
          onClick={() => onNavigate('wrong')}
        />
        <MenuCard 
          icon={<Shuffle className="text-purple-500" />} 
          title="随机挑战" 
          desc="打破定式" 
          color="bg-purple-50"
          onClick={() => onNavigate('random')}
        />
      </div>

      {/* Recent Activity */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <History className="text-slate-400" size={20} />
          <h3 className="font-bold text-slate-700">最近动态</h3>
        </div>
        {stats.totalAnswered === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p className="text-sm">还没有答题记录，开始学习吧！</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <BookOpen size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">学习效率</p>
                  <p className="text-xs text-slate-500">累计答对 {stats.correctCount} 题</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-indigo-600">+{stats.correctCount}</p>
                <p className="text-[10px] text-slate-400 uppercase">Points</p>
              </div>
            </div>
          </div>
        )}
      </section>


    </div>
  );
};

const MenuCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; color: string; onClick: () => void }> = ({ icon, title, desc, color, onClick }) => (
  <button 
    onClick={onClick}
    className={`${color} p-5 rounded-[2rem] text-left hover:scale-[1.02] active:scale-95 transition-all shadow-sm flex flex-col justify-between h-36`}
  >
    <div className="bg-white p-2 rounded-2xl w-fit shadow-sm">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 mt-1">{desc}</p>
    </div>
  </button>
);
