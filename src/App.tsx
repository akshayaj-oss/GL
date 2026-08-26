import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { questions, personalities, type Category } from './data';
import { Dashboard } from './components/Dashboard';

export type AppState = 'landing' | 'quiz' | 'transition' | 'reveal';

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Category[]>([]);
  const [resultCategory, setResultCategory] = useState<Category | null>(null);
  const [employeeCode, setEmployeeCode] = useState('');
  const { width, height } = useWindowSize();

  const [adminClickCount, setAdminClickCount] = useState(0);

  // Admin routing check: keep dashboard strictly isolated from the employee flow
  const isAdmin = window.location.pathname === '/admin' || 
                  window.location.pathname === '/dashboard' || 
                  window.location.search.includes('admin=true');
                  
  if (isAdmin || adminClickCount >= 5) {
    return (
      <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center p-6 overflow-auto">
        <div className="w-full max-w-4xl pt-10">
          <Dashboard />
        </div>
      </div>
    );
  }

  const handleStart = () => {
    if (!employeeCode.trim()) return;
    setAppState('quiz');
  };

  const handleAnswer = (category: Category) => {
    const newAnswers = [...answers, category];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Category[]) => {
    setAppState('transition');
    
    // Scoring logic
    const counts: Record<string, number> = { fitness: 0, food: 0, travel: 0, books: 0 };
    const firstAppearance: Record<string, number> = {};

    finalAnswers.forEach((cat, index) => {
      counts[cat]++;
      if (firstAppearance[cat] === undefined) {
        firstAppearance[cat] = index;
      }
    });

    let maxCount = -1;
    let tiedCategories: Category[] = [];
    
    for (const cat in counts) {
      if (counts[cat] > maxCount) {
        maxCount = counts[cat];
        tiedCategories = [cat as Category];
      } else if (counts[cat] === maxCount) {
        tiedCategories.push(cat as Category);
      }
    }

    let winner: Category;
    if (tiedCategories.length === 1) {
      winner = tiedCategories[0];
    } else {
      const q5Cat = finalAnswers[4];
      if (tiedCategories.includes(q5Cat)) {
        winner = q5Cat;
      } else {
        // Tie breaker: earliest appearance among tied
        let earliestCat = tiedCategories[0];
        let earliestIndex = firstAppearance[earliestCat];
        for (let i = 1; i < tiedCategories.length; i++) {
          if (firstAppearance[tiedCategories[i]] < earliestIndex) {
            earliestIndex = firstAppearance[tiedCategories[i]];
            earliestCat = tiedCategories[i];
          }
        }
        winner = earliestCat;
      }
    }

    setResultCategory(winner);

    // Save to backend asynchronously
    fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personality: winner, employee_code: employeeCode.trim() })
    }).catch(err => console.error("Failed to save result:", err));

    setTimeout(() => {
      setAppState('reveal');
    }, 6500);
  };

  return (
    <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center p-6 overflow-hidden">
      <AnimatePresence mode="wait">
        {appState === 'landing' && (
          <motion.div 
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md w-full flex flex-col items-center text-center space-y-8 relative"
          >
            <div className="absolute -top-12 left-0 right-0 text-center text-brand-lavender/60 font-semibold tracking-widest text-sm uppercase">
              Great Learning
            </div>
            
            <div className="space-y-4">
              <div 
                className="text-4xl cursor-default" 
                onClick={() => setAdminClickCount(c => c + 1)}
              >
                👀
              </div>
              <h1 className="text-5xl font-heading font-bold tracking-wide">FIND YOUR TRIBE</h1>
              <p className="text-xl font-semibold">5 questions. One very important discovery. 👀</p>
            </div>
            <p className="text-brand-lavender text-lg">We all have that one thing we could talk about for hours. Let's find yours.</p>
            
            <div className="w-full space-y-6 pt-4">
              <input
                type="text"
                placeholder="Enter Employee Code"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 font-semibold py-4 px-6 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-brand-lavender text-center"
              />
              <button 
                onClick={handleStart}
                disabled={!employeeCode.trim()}
                className="w-full bg-brand-lavender text-brand-navy font-bold py-4 px-8 rounded-full text-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                LET'S FIND OUT →
              </button>
            </div>
          </motion.div>
        )}

        {appState === 'quiz' && (
          <motion.div
            key={`quiz-${currentQuestion}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="max-w-md w-full flex flex-col h-full py-8"
          >
            <div className="flex items-center space-x-4 mb-8">
              <span className="font-bold">{currentQuestion + 1}/5</span>
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-brand-lavender"
                  initial={{ width: `${((currentQuestion) / 5) * 100}%` }}
                  animate={{ width: `${((currentQuestion + 1) / 5) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="text-3xl font-heading font-bold mb-10">{questions[currentQuestion].question}</h2>

            <div className="space-y-4 mt-auto">
              {questions[currentQuestion].options.map((option, idx) => {
                const letters = ['A', 'B', 'C', 'D'];
                return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option.category)}
                  className="w-full text-left bg-white/10 hover:bg-white/20 p-5 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] text-lg border border-white/10 flex items-center group"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-4 text-sm font-bold text-brand-lavender group-hover:bg-brand-lavender group-hover:text-brand-navy transition-colors">
                    {letters[idx]}
                  </span>
                  <span>{option.text}</span>
                </button>
              )})}
            </div>
          </motion.div>
        )}

        {appState === 'transition' && (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md w-full flex flex-col items-center justify-center text-center space-y-8 min-h-[400px]"
          >
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="text-2xl font-semibold">Interesting choices.</motion.p>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.0, duration: 0.8 }} className="text-2xl font-semibold">We weren't asking you what you like.</motion.p>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.5, duration: 0.8 }} className="text-2xl font-semibold">We were figuring out what makes you, you.</motion.p>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 5.0, duration: 0.8 }} className="text-2xl font-semibold text-yellow-400">And we think we've figured it out. 👀</motion.p>
          </motion.div>
        )}

        {appState === 'reveal' && resultCategory && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md w-full flex flex-col items-center text-center relative"
          >
            <Confetti
              width={width}
              height={height}
              recycle={false}
              numberOfPieces={400}
              gravity={0.15}
              style={{ position: 'fixed', top: 0, left: 0, zIndex: 50, pointerEvents: 'none' }}
            />
            
            <div className="bg-white/10 border border-white/20 p-8 rounded-[2rem] backdrop-blur-sm w-full relative z-10 mt-12 shadow-xl">
              <div className="text-6xl mb-6">{personalities[resultCategory].icon}</div>
              <h2 className="text-4xl font-heading font-bold mb-6 text-white leading-tight">
                {personalities[resultCategory].title}
              </h2>
              <p className="text-lg text-brand-lavender mb-6 leading-relaxed">
                {personalities[resultCategory].subtitle}
              </p>
              <p className="text-xl font-bold text-yellow-400">
                Vibe: "{personalities[resultCategory].vibe}"
              </p>
            </div>

            <p className="mt-10 text-lg font-semibold">
              Your tribe goes live on VIBE on 1st September 👀
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
