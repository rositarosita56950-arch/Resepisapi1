import React, { useState } from 'react';
import { TRADITIONAL_KITCHEN_TIPS } from '../data/kitchenTips';
import { Sparkles, ChevronDown, ChevronUp, BookOpen, Quote } from 'lucide-react';
import { soundFX } from '../utils/audio';

export const KitchenTips: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('tip-kluwek');

  const toggleExpand = (id: string) => {
    soundFX.playClick();
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Intro Header */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 space-y-1.5">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-sm">
          <BookOpen className="w-4 h-4 text-amber-700 dark:text-amber-400" />
          <span>Rahasia & Filosofi Dapur Leluhur</span>
        </div>
        <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
          Kumpulan teknik memasak tradisional Nusantara yang diwariskan turun-temurun untuk menjaga keaslian rasa rempah dan kesempurnaan tekstur hidangan.
        </p>
      </div>

      {/* List of Tips */}
      <div className="space-y-3">
        {TRADITIONAL_KITCHEN_TIPS.map((tip) => {
          const isExpanded = expandedId === tip.id;

          return (
            <div
              key={tip.id}
              className="bg-white dark:bg-stone-850 rounded-2xl border border-stone-200/80 dark:border-stone-800 overflow-hidden shadow-sm transition-all"
            >
              {/* Header trigger */}
              <button
                type="button"
                onClick={() => toggleExpand(tip.id)}
                className="w-full p-4 flex items-start justify-between text-left gap-3 hover:bg-stone-50/50 dark:hover:bg-stone-800/40 transition-colors"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                    {tip.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 font-serif-display leading-snug">
                    {tip.title}
                  </h3>
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                    {tip.summary}
                  </p>
                </div>

                <div className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 shrink-0 mt-1">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-4 pb-5 pt-1 space-y-4 border-t border-stone-100 dark:border-stone-800">
                  {/* Traditional Quote */}
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/80 border border-stone-200/60 dark:border-stone-800 flex items-start gap-2.5">
                    <Quote className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs italic text-stone-600 dark:text-stone-300 font-serif-display">
                      {tip.traditionalQuote}
                    </p>
                  </div>

                  {/* Step Points */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide block">
                      Panduan Praktis:
                    </span>
                    <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
                      {tip.content.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                          <span className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
