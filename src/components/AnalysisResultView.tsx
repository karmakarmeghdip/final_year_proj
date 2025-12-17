import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { currentViewAtom, analysisResultAtom } from '../store/atoms';
import { 
  Quote, 
  ScanEye, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Share2, 
  Flag, 
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { clsx } from 'clsx';

const AnalysisResultView = () => {
  const [data] = useAtom(analysisResultAtom);
  const [, setView] = useAtom(currentViewAtom);
  const [animateScore, setAnimateScore] = useState(0);

  useEffect(() => {
    if (data) {
      // Simple animation for the score
      const timer = setTimeout(() => {
        setAnimateScore(data.truth_score);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [data]);

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-400 animate-pulse">Loading analysis...</div>
      </div>
    );
  }

  // Color Logic
  const getThemeColor = (score: number) => {
    if (score < 40) return {
      bg: 'bg-red-500',
      text: 'text-red-500',
      border: 'border-red-500',
      gradient: 'from-red-600 to-red-900',
      badge: 'bg-red-500/10 text-red-400 border-red-500/20'
    };
    if (score < 80) return {
      bg: 'bg-amber-500',
      text: 'text-amber-500',
      border: 'border-amber-500',
      gradient: 'from-amber-600 to-amber-900',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    };
    return {
      bg: 'bg-emerald-500',
      text: 'text-emerald-500',
      border: 'border-emerald-500',
      gradient: 'from-emerald-600 to-emerald-900',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    };
  };

  const theme = getThemeColor(data.truth_score);

  // Gauge Calculation
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((animateScore / 100) * (circumference / 2)); // Only use half circle

  return (
    <div className="h-screen overflow-hidden bg-black flex flex-col relative animate-in fade-in duration-500">
      
      {/* A. Header (The Verdict) */}
      <div className={clsx("relative pb-10 pt-6 px-6 rounded-b-3xl shadow-2xl overflow-hidden")}>
        {/* Background Gradient */}
        <div className={clsx("absolute inset-0 bg-gradient-to-b opacity-20", theme.gradient)} />
        <div className={clsx("absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent")} />

        {/* Back Button */}
        <button 
          onClick={() => setView('input')}
          className="relative z-10 mb-4 p-2 -ml-2 rounded-full hover:bg-white/10 text-zinc-300 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center relative z-10">
          {/* Gauge/Meter */}
          <div className="relative w-48 h-24 flex items-start justify-center overflow-hidden mb-4">
            <svg className="w-48 h-48 transform rotate-180"
              viewBox="0 0 192 192"
            >
              {/* Background Track */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-zinc-800"
                strokeDasharray={`${circumference / 2} ${circumference}`}
                strokeLinecap="round"
              />
              {/* Active Track */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className={clsx("transition-all duration-1000 ease-out", theme.text)}
                strokeDasharray={`${circumference / 2} ${circumference}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute bottom-0 w-full text-center">
              <span className={clsx("text-5xl font-bold tracking-tighter text-white")}>
                {animateScore}
              </span>
              <span className="text-xs text-zinc-400 font-medium block uppercase tracking-widest mt-1">
                Truth Score
              </span>
            </div>
          </div>

          {/* Verdict Label */}
          <div className={clsx(
            "px-4 py-1.5 rounded-full border bg-black/50 backdrop-blur-md mt-4",
            theme.border,
            theme.text
          )}>
            <span className="text-lg font-bold tracking-widest uppercase flex items-center gap-2">
              {data.truth_score < 80 && <AlertTriangle className="w-5 h-5" />}
              {data.verdict_category}
            </span>
          </div>
        </div>
      </div>

      {/* B. The "Explainable AI" Cards (Scrollable Body) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 -mt-4 relative z-20 pb-64">
        
        {/* Card 1: Executive Summary */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
              <Quote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-1">Executive Summary</h3>
              <p className="text-zinc-200 leading-relaxed text-sm">
                {data.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Visual Evidence (Conditional) */}
        {data.visual_analysis.is_manipulated && (
          <div className="bg-red-950/20 border border-red-900/50 rounded-2xl p-5 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-900/30 rounded-lg text-red-400">
                <ScanEye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-400 uppercase tracking-wider mb-1">
                  Digital Manipulation Detected
                </h3>
                <p className="text-zinc-300 text-sm">
                  {data.visual_analysis.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Card 3: Logic Tutor (Fallacy Detector) */}
        {data.logical_fallacies.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">
              Logical Fallacies Detected
            </h3>
            <div className="space-y-4">
              {data.logical_fallacies.map((fallacy, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={clsx("text-xs px-2 py-0.5 rounded border font-medium", theme.badge)}>
                      {fallacy.type}
                    </span>
                  </div>
                  <p className="text-zinc-300 text-sm italic border-l-2 border-zinc-700 pl-3 py-1">
                    "{fallacy.text}"
                  </p>
                  <p className="text-xs text-zinc-500">
                    {fallacy.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Card 4: Source Cross-Reference */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">
            Fact-Check Sources
          </h3>
          <div className="space-y-3">
            {data.sources.map((source, index) => (
              <a 
                key={index} 
                href={source.url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  {source.is_supporting ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-zinc-200 text-sm font-medium group-hover:text-white transition-colors">
                      {source.name}
                    </span>
                    <span className="text-xs text-zinc-500 truncate max-w-[150px]">
                      {new URL(source.url).hostname}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* C. Footer (Sticky Action Bar) */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-zinc-800 p-4 z-50">
        <div className="max-w-md mx-auto flex flex-col gap-3">
          <button className="w-full bg-white hover:bg-zinc-200 text-black font-semibold py-3.5 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 active:scale-[0.98]">
            <Share2 className="w-4 h-4" />
            Share Report Image
          </button>
          <button className="w-full bg-transparent hover:bg-zinc-900 text-zinc-500 font-medium py-2 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
            <Flag className="w-3 h-3" />
            Report as Incorrect
          </button>
        </div>
      </div>

    </div>
  );
};

export default AnalysisResultView;
