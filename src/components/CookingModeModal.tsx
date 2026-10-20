import React, { useState, useEffect } from 'react';
import { Recipe } from '../types/recipe';
import { X, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, Sparkles, Lightbulb } from 'lucide-react';
import { soundFX } from '../utils/audio';
import confetti from 'canvas-confetti';

interface CookingModeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({ recipe, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const currentStep = recipe.steps[currentStepIndex];

  // Timer states
  const initialSeconds = (currentStep?.durationMinutes || 5) * 60;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);

  // Update timer whenever step changes
  useEffect(() => {
    const newSeconds = (currentStep?.durationMinutes || 5) * 60;
    setSecondsLeft(newSeconds);
    setIsTimerRunning(false);
    setTimerFinished(false);
  }, [currentStepIndex, currentStep?.durationMinutes]);

  // Timer countdown interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            setIsTimerRunning(false);
            setTimerFinished(true);
            soundFX.playTimerDone();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsLeft]);

  const toggleTimer = () => {
    soundFX.playClick();
    if (secondsLeft === 0) {
      setSecondsLeft((currentStep?.durationMinutes || 5) * 60);
      setTimerFinished(false);
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(!isTimerRunning);
    }
  };

  const resetTimer = () => {
    soundFX.playClick();
    setIsTimerRunning(false);
    setTimerFinished(false);
    setSecondsLeft((currentStep?.durationMinutes || 5) * 60);
  };

  const toggleStepCompleted = (index: number) => {
    soundFX.playClick();
    setCompletedSteps((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        const next = [...prev, index];
        if (next.length === recipe.steps.length) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
        return next;
      }
    });
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalStepsCount = recipe.steps.length;
  const isAllCompleted = completedSteps.length === totalStepsCount;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden border border-stone-200 dark:border-stone-800">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-900/70">
          <div>
            <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 tracking-wider uppercase">
              Mode Panduan Memasak
            </div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
              {recipe.shortTitle}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
            aria-label="Tutup mode memasak"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5">
          <div
            className="bg-amber-600 h-1.5 transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / totalStepsCount) * 100}%` }}
          />
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          {/* Step Indicator Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Langkah {currentStepIndex + 1} dari {totalStepsCount}
            </span>
            <button
              type="button"
              onClick={() => toggleStepCompleted(currentStepIndex)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                completedSteps.includes(currentStepIndex)
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{completedSteps.includes(currentStepIndex) ? 'Selesai' : 'Tandai Selesai'}</span>
            </button>
          </div>

          {/* Big Readable Step Title & Instructions */}
          <div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-serif-display leading-snug">
              {currentStep.title}
            </h3>
            <p className="mt-3 text-base text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
              {currentStep.instruction}
            </p>
          </div>

          {/* Chef Tip Callout if available */}
          {currentStep.tip && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-stone-800 dark:text-amber-200 text-sm flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-amber-900 dark:text-amber-300 text-xs uppercase tracking-wide mb-0.5">
                  Tips Penting
                </span>
                <span className="leading-relaxed">{currentStep.tip}</span>
              </div>
            </div>
          )}

          {/* Interactive Cooking Timer */}
          <div className="p-5 rounded-2xl bg-stone-100 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 flex flex-col items-center text-center">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
              Pengatur Waktu Memasak
            </span>
            <div
              className={`text-4xl font-extrabold font-mono tabular-nums tracking-tight my-2 ${
                timerFinished ? 'text-emerald-600 dark:text-emerald-400 animate-bounce' : 'text-stone-900 dark:text-stone-100'
              }`}
            >
              {formatTime(secondsLeft)}
            </div>

            {timerFinished && (
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Waktu tahap ini telah selesai! Silakan lanjut.</span>
              </div>
            )}

            {/* Timer Controls */}
            <div className="flex items-center gap-3 mt-1">
              <button
                type="button"
                onClick={toggleTimer}
                className={`min-w-[44px] min-h-[44px] px-5 py-2 rounded-xl font-medium text-sm flex items-center gap-2 transition-all shadow-sm ${
                  isTimerRunning
                    ? 'bg-amber-700 text-white hover:bg-amber-800'
                    : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800'
                }`}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Jeda</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>{secondsLeft === 0 ? 'Mulai Ulang' : 'Mulai Timer'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetTimer}
                title="Atur Ulang Waktu"
                className="min-w-[44px] min-h-[44px] px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors flex items-center justify-center"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Recipe Completion Banner */}
          {isAllCompleted && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-2">
              <div className="text-emerald-700 dark:text-emerald-300 font-bold text-base flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Selamat! Hidangan Siap Disajikan</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                Semua tahapan resep tradisional telah lengkap dikerjakan. Selamat menikmati kelezatan otentik Nusantara bersama keluarga!
              </p>
            </div>
          )}
        </div>

        {/* Bottom Step Navigation Bar */}
        <div className="p-4 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={currentStepIndex === 0}
            onClick={() => {
              soundFX.playClick();
              setCurrentStepIndex((prev) => Math.max(0, prev - 1));
            }}
            className="min-h-[44px] px-4 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          <span className="text-xs font-medium text-stone-500 tabular-nums">
            {currentStepIndex + 1} / {totalStepsCount}
          </span>

          <button
            type="button"
            disabled={currentStepIndex === totalStepsCount - 1}
            onClick={() => {
              soundFX.playClick();
              setCurrentStepIndex((prev) => Math.min(totalStepsCount - 1, prev + 1));
            }}
            className="min-h-[44px] px-4 rounded-xl bg-amber-800 text-white hover:bg-amber-900 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-colors"
          >
            <span>Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
