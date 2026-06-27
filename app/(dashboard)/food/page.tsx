'use client';

import { useState, useEffect, useRef } from 'react';
import { BentoCard } from '../../../components/dashboard/bento-card';
import { Apple, Loader2, CheckCircle2, AlertCircle, Send, Mic, MicOff, History } from 'lucide-react';
import { format } from 'date-fns';

interface FoodItem {
  name: string;
  amount: number;
  unit: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
}

interface FoodAnalysis {
  analysis: {
    items: FoodItem[];
    summary: {
      calories: number;
      protein: number;
      carbohydrates: number;
      fat: number;
      fiber: number;
    };
  };
}

export default function FoodPage() {
  const [rawInput, setRawInput] = useState('');
  const [mealLabel, setMealLabel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FoodAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Voice Recognition State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Recent Meals State
  const [recentMeals, setRecentMeals] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/food/history');
      if (res.ok) {
        const data = await res.json();
        setRecentMeals(data.recentFood || []);
      }
    } catch (err) {
      console.error("Failed to load food history");
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setRawInput(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setRawInput(''); // Clear input for new dictation
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawInput.trim() || isLoading) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('rawInput', rawInput);
      if (mealLabel) formData.append('mealLabel', mealLabel);

      const res = await fetch('/api/analysis/food', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze food');
      }

      setResult(data as FoodAnalysis);
      setRawInput('');
      setMealLabel('');
      fetchHistory(); // Refresh history
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 max-w-6xl mx-auto">
      <div className="lg:col-span-7 flex flex-col gap-6">
        <BentoCard className="shrink-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
              <Apple className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">Log Meal</h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">Natural language analysis</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea 
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="I had a bowl of oatmeal with a sliced banana and a cup of black coffee..." 
                className="min-h-[160px] w-full rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-black/40 p-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-300 dark:focus:border-white/[0.15] focus:bg-slate-50 dark:focus:bg-black/60 transition-colors resize-none pr-14 shadow-sm dark:shadow-inner"
                disabled={isLoading}
              />
              {recognitionRef.current && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute right-3 bottom-4 p-2.5 rounded-lg transition-all ${isListening ? 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white border border-transparent'}`}
                  title={isListening ? "Stop listening" : "Start dictation"}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              )}
            </div>
            <div>
              <input 
                type="text"
                value={mealLabel}
                onChange={(e) => setMealLabel(e.target.value)}
                placeholder="Meal label (e.g., Breakfast, Post-workout) - Optional" 
                className="w-full rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-black/40 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-300 dark:focus:border-white/[0.15] focus:bg-slate-50 dark:focus:bg-black/60 transition-colors shadow-sm dark:shadow-inner"
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || !rawInput.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black px-5 py-3 text-sm font-medium dark:hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing Nutrition...</>
              ) : (
                <><Send className="h-4 w-4" /> Analyze & Log</>
              )}
            </button>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 mt-4">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p className="text-xs">{error}</p>
              </div>
            )}
          </form>
        </BentoCard>

        {/* Recent Meals Section */}
        <BentoCard className="flex-1">
          <div className="flex items-center gap-2 mb-6">
            <History className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Recent Meals</h3>
          </div>
          
          {isHistoryLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
            </div>
          ) : recentMeals.length === 0 ? (
            <div className="text-center p-8 text-slate-500 text-xs">No meals logged recently.</div>
          ) : (
            <div className="space-y-3">
              {recentMeals.map((meal) => (
                <div key={meal._id} className="bg-slate-50 dark:bg-white/[0.02] rounded-xl p-4 border border-slate-200 dark:border-white/[0.04] shadow-sm dark:shadow-none">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{meal.mealLabel || 'Logged Meal'}</p>
                    <span className="text-[10px] text-slate-500">{format(new Date(meal.createdAt), 'MMM d, h:mm a')}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic mb-3 line-clamp-2">"{meal.rawInput}"</p>
                  <div className="flex gap-4 text-xs">
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">{meal.summary?.calories} kcal</span>
                    <span className="text-slate-600 dark:text-slate-300">P: {meal.summary?.protein}g</span>
                    <span className="text-slate-600 dark:text-slate-300">C: {meal.summary?.carbohydrates}g</span>
                    <span className="text-slate-600 dark:text-slate-300">F: {meal.summary?.fat}g</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </BentoCard>
      </div>

      <div className="lg:col-span-5 h-full">
        <div className="sticky top-24">
          <BentoCard className="h-full bg-slate-50/50 dark:bg-slate-900/20">
            <div className="mb-6">
              <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Analysis Results</h3>
              <p className="text-xs text-slate-500">
                Gemini AI breaks down your natural language input into structured nutritional data before saving.
              </p>
            </div>

            {!result && !isLoading && (
              <div className="flex flex-col items-center justify-center h-[200px] text-center rounded-xl border border-dashed border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.01]">
                <Apple className="h-6 w-6 text-slate-600 mb-3" />
                <p className="text-xs text-slate-500">Results will appear here</p>
              </div>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center h-[200px] space-y-3 rounded-xl border border-slate-200 dark:border-white/[0.04] bg-slate-50 dark:bg-white/[0.01]">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-500 dark:text-emerald-400" />
                <p className="text-xs text-slate-400 animate-pulse">Running Gemini analysis...</p>
              </div>
            )}

            {result && !isLoading && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-medium">Successfully logged!</span>
                </div>
                
                <div className="bg-white dark:bg-black/20 rounded-xl p-4 border border-slate-200 dark:border-white/[0.04] shadow-sm dark:shadow-none overflow-hidden">
                  <h4 className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Extracted Items</h4>
                  <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                    {result.analysis?.items?.map((item: FoodItem, i: number) => (
                      <div key={i} className="flex justify-between items-center text-xs border-b border-slate-200 dark:border-white/[0.04] pb-2.5 last:border-0 last:pb-0">
                        <span className="text-slate-700 dark:text-slate-300 capitalize">{item.name} <span className="text-slate-500 text-[10px] ml-1">({item.amount} {item.unit})</span></span>
                        <span className="text-emerald-600 dark:text-emerald-400">{item.calories} kcal</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-slate-50 dark:bg-white/[0.02] rounded-xl p-3 text-center border border-slate-200 dark:border-white/[0.04]">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">PRO</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{result.analysis?.summary?.protein}g</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/[0.02] rounded-xl p-3 text-center border border-slate-200 dark:border-white/[0.04]">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">CARB</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{result.analysis?.summary?.carbohydrates}g</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/[0.02] rounded-xl p-3 text-center border border-slate-200 dark:border-white/[0.04]">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">FAT</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{result.analysis?.summary?.fat}g</p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-3 text-center border border-emerald-200 dark:border-emerald-500/20">
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">KCAL</p>
                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{result.analysis?.summary?.calories}</p>
                  </div>
                </div>
              </div>
            )}
          </BentoCard>
        </div>
      </div>
    </div>
  );
}
