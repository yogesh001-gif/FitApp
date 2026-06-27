'use client';

import { useState } from 'react';
import { BentoCard } from '../../../components/dashboard/bento-card';
import { Activity, Dumbbell, Apple, Target, Settings, ChevronRight, ChevronLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { calculateNutritionTargets } from '../../../lib/metrics';

type WizardStep = 1 | 2 | 3 | 4;

export function PlansWizard({ initialProfile }: { initialProfile: any }) {
  const [step, setStep] = useState<WizardStep>(1);
  const [goal, setGoal] = useState<'weight_loss' | 'muscle_gain' | 'maintenance'>(initialProfile.goal === 'body_recomposition' ? 'muscle_gain' : initialProfile.goal);
  const [experience, setExperience] = useState('Intermediate');
  const [equipment, setEquipment] = useState('Full Gym');
  const [dietPref, setDietPref] = useState('No restrictions');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  // Live preview calculations
  const previewTargets = calculateNutritionTargets({
    ...initialProfile,
    goal: goal
  });

  const generatePlan = async () => {
    setIsGenerating(true);
    try {
      // Parallel generation for "wow" effect
      const [workoutRes, dietRes] = await Promise.all([
        fetch('/api/plans/workout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ goal, experienceLevel: experience, trainingDaysPerWeek: '4', equipmentAvailability: equipment })
        }),
        fetch('/api/plans/diet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ goal, dietaryPreference: dietPref, budgetPreference: 'Medium', mealFrequency: '4 meals' })
        })
      ]);

      setGeneratedPlan({ complete: true });
      setStep(4);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 px-4">
        <h1 className="text-xl font-semibold text-white tracking-tight">Plan Generator</h1>
        <div className="flex gap-1.5">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 w-10 rounded-full transition-colors ${step >= i ? 'bg-white' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Wizard Form */}
        <div className="lg:col-span-2">
          <BentoCard className="min-h-[400px] flex flex-col relative overflow-hidden">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Target className="h-4 w-4 text-blue-400" />
                  </div>
                  <h2 className="text-sm font-semibold text-white">Select Primary Goal</h2>
                </div>
                
                <div className="grid gap-4">
                  {[
                    { id: 'weight_loss', label: 'Weight Loss', desc: 'Caloric deficit for fat reduction' },
                    { id: 'muscle_gain', label: 'Muscle Gain', desc: 'Caloric surplus for hypertrophy' },
                    { id: 'maintenance', label: 'Maintenance', desc: 'Maintain current body composition' }
                  ].map(g => (
                    <button
                      key={g.id}
                      onClick={() => setGoal(g.id as any)}
                      className={`text-left p-5 rounded-xl border transition-all ${goal === g.id ? 'bg-white/[0.04] border-white/[0.15]' : 'bg-black/20 border-white/[0.06] hover:bg-white/[0.02] hover:border-white/[0.1]'}`}
                    >
                      <p className={`text-sm font-semibold ${goal === g.id ? 'text-white' : 'text-slate-300'}`}>{g.label}</p>
                      <p className="text-xs text-slate-500 mt-1.5">{g.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <Dumbbell className="h-4 w-4 text-emerald-400" />
                  </div>
                  <h2 className="text-sm font-semibold text-white">Training Parameters</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 block mb-3">Experience Level</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                        <button
                          key={lvl}
                          onClick={() => setExperience(lvl)}
                          className={`p-3 text-xs rounded-xl border transition-all ${experience === lvl ? 'bg-white/[0.04] border-white/[0.15] text-white font-medium' : 'bg-black/20 border-white/[0.06] text-slate-400 hover:bg-white/[0.02]'}`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 block mb-3">Available Equipment</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Full Gym', 'Dumbbells Only', 'Bodyweight', 'Resistance Bands'].map(eq => (
                        <button
                          key={eq}
                          onClick={() => setEquipment(eq)}
                          className={`p-3 text-xs rounded-xl border transition-all ${equipment === eq ? 'bg-white/[0.04] border-white/[0.15] text-white font-medium' : 'bg-black/20 border-white/[0.06] text-slate-400 hover:bg-white/[0.02]'}`}
                        >
                          {eq}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <Apple className="h-4 w-4 text-amber-400" />
                  </div>
                  <h2 className="text-sm font-semibold text-white">Dietary Preferences</h2>
                </div>
                
                <div className="grid gap-3">
                  {['No restrictions', 'Vegetarian', 'Vegan', 'Keto', 'Paleo'].map(diet => (
                    <button
                      key={diet}
                      onClick={() => setDietPref(diet)}
                      className={`text-left p-4 rounded-xl border transition-all text-sm ${dietPref === diet ? 'bg-white/[0.04] border-white/[0.15] text-white font-medium' : 'bg-black/20 border-white/[0.06] text-slate-400 hover:bg-white/[0.02]'}`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col items-center justify-center text-center h-full animate-in zoom-in-95 duration-500 py-12">
                <div className="h-16 w-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </div>
                <h2 className="text-lg font-semibold text-white mb-2">Plans Generated!</h2>
                <p className="text-xs text-slate-500 max-w-[250px] mb-8 leading-relaxed">
                  Your custom AI workout and diet plans have been saved to your dashboard.
                </p>
                <button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-white text-black px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            )}

            {step < 4 && (
              <div className="mt-auto pt-8 flex justify-between">
                <button 
                  onClick={() => setStep(step - 1 as WizardStep)}
                  disabled={step === 1 || isGenerating}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-white transition-colors disabled:opacity-0"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                
                {step < 3 ? (
                  <button 
                    onClick={() => setStep(step + 1 as WizardStep)}
                    className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button 
                    onClick={generatePlan}
                    disabled={isGenerating}
                    className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
                  >
                    {isGenerating ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating...</> : <><Settings className="h-3.5 w-3.5" /> Generate</>}
                  </button>
                )}
              </div>
            )}
          </BentoCard>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-1">
          <BentoCard className="h-full bg-slate-900/20 border-dashed relative overflow-hidden">
            <div className="flex items-center gap-2 mb-8">
              <Activity className="h-4 w-4 text-slate-500" />
              <h3 className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Live Preview</h3>
            </div>

            <div className="space-y-8 relative z-10">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Target Calories</p>
                <p className="text-3xl font-semibold text-white tracking-tight">{previewTargets.calorieTarget} <span className="text-xs text-slate-500 font-normal">kcal</span></p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Protein</p>
                  <p className="text-sm font-semibold text-white">{previewTargets.proteinTarget}g</p>
                </div>
                <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Carbs</p>
                  <p className="text-sm font-semibold text-white">{previewTargets.carbohydrateTarget}g</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/[0.06]">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-4">AI Plan Parameters</p>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Experience</span>
                    <span className="text-slate-300 font-medium">{experience}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Equipment</span>
                    <span className="text-slate-300 font-medium truncate max-w-[120px] text-right">{equipment}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Diet</span>
                    <span className="text-slate-300 font-medium">{dietPref}</span>
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </div>
  );
}
