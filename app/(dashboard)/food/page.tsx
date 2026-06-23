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
        <BentoCard gradient="secondary" className="shrink-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/20 text-secondary border border-secondary/30">
              <Apple className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-white">Log Meal</h2>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Natural language analysis</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea 
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="Example: I had a bowl of oatmeal with a sliced banana and a cup of black coffee for breakfast." 
                className="min-h-[160px] w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none pr-14"
                disabled={isLoading}
              />
              {recognitionRef.current && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute right-3 bottom-4 p-3 rounded-full transition-all ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse border border-red-500/50' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  title={isListening ? "Stop listening" : "Start dictation"}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
              )}
            </div>
            <div>
              <input 
                type="text"
                value={mealLabel}
                onChange={(e) => setMealLabel(e.target.value)}
                placeholder="Meal label (e.g., Breakfast, Post-workout) - Optional" 
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || !rawInput.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-secondary text-secondary-foreground px-5 py-4 font-medium hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing Nutrition...</>
              ) : (
                <><Send className="h-5 w-5" /> Analyze & Log Meal</>
              )}
            </button>

            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive mt-4">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </form>
        </BentoCard>

        {/* Recent Meals Section */}
        <BentoCard className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <History className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recent Meals</h3>
          </div>
          
          {isHistoryLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : recentMeals.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground text-sm">No meals logged recently.</div>
          ) : (
            <div className="space-y-4">
              {recentMeals.map((meal) => (
                <div key={meal._id} className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-white">{meal.mealLabel || 'Logged Meal'}</p>
                    <span className="text-xs text-muted-foreground">{format(new Date(meal.createdAt), 'MMM d, h:mm a')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground italic mb-3 line-clamp-2">"{meal.rawInput}"</p>
                  <div className="flex gap-4 text-xs font-medium">
                    <span className="text-secondary">{meal.summary?.calories} kcal</span>
                    <span className="text-white">P: {meal.summary?.protein}g</span>
                    <span className="text-white">C: {meal.summary?.carbohydrates}g</span>
                    <span className="text-white">F: {meal.summary?.fat}g</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </BentoCard>
      </div>

      <div className="lg:col-span-5 h-full">
        <div className="sticky top-24">
          <BentoCard className="h-full bg-card/60">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Analysis Results</h3>
              <p className="text-xs text-muted-foreground">
                Gemini AI breaks down your natural language input into structured nutritional data before saving.
              </p>
            </div>

            {!result && !isLoading && (
              <div className="flex flex-col items-center justify-center h-[200px] text-center border border-dashed border-white/10 rounded-2xl bg-black/10">
                <Apple className="h-8 w-8 text-muted-foreground mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">Results will appear here</p>
              </div>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center h-[200px] space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                <p className="text-sm text-secondary animate-pulse">Running Gemini analysis...</p>
              </div>
            )}

            {result && !isLoading && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 text-primary bg-primary/10 p-3 rounded-xl border border-primary/20">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Successfully logged!</span>
                </div>
                
                <div className="bg-black/40 rounded-2xl p-4 border border-white/5 overflow-hidden">
                  <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Extracted Items</h4>
                  <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                    {result.analysis?.items?.map((item: FoodItem, i: number) => (
                      <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0">
                        <span className="text-white capitalize">{item.name} <span className="text-muted-foreground text-xs">({item.amount} {item.unit})</span></span>
                        <span className="text-secondary font-medium">{item.calories} kcal</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">PRO</p>
                    <p className="text-lg font-display font-semibold text-white">{result.analysis?.summary?.protein}g</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">CARB</p>
                    <p className="text-lg font-display font-semibold text-white">{result.analysis?.summary?.carbohydrates}g</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">FAT</p>
                    <p className="text-lg font-display font-semibold text-white">{result.analysis?.summary?.fat}g</p>
                  </div>
                  <div className="bg-secondary/10 rounded-xl p-3 text-center border border-secondary/20">
                    <p className="text-[10px] text-secondary uppercase tracking-wider mb-1">KCAL</p>
                    <p className="text-lg font-display font-semibold text-secondary">{result.analysis?.summary?.calories}</p>
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
