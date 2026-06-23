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
        <h1 className="text-2xl font-display font-semibold text-white">Plan Generator</h1>
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 w-12 rounded-full ${step >= i ? 'bg-primary' : 'bg-white/10'}`} />
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
                  <Target className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-medium text-white">Select Primary Goal</h2>
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
                      className={`text-left p-5 rounded-2xl border transition-all ${goal === g.id ? 'bg-primary/20 border-primary shadow-glow shadow-primary/20' : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10'}`}
                    >
                      <p className={`font-semibold ${goal === g.id ? 'text-primary' : 'text-white'}`}>{g.label}</p>
                      <p className="text-sm text-muted-foreground mt-1">{g.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <Dumbbell className="h-5 w-5 text-secondary" />
                  <h2 className="text-lg font-medium text-white">Training Parameters</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-3">Experience Level</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                        <button
                          key={lvl}
                          onClick={() => setExperience(lvl)}
                          className={`p-3 text-sm rounded-xl border transition-all ${experience === lvl ? 'bg-secondary/20 border-secondary text-secondary font-medium' : 'bg-black/20 border-white/5 text-slate-300 hover:bg-white/5'}`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground block mb-3">Available Equipment</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Full Gym', 'Dumbbells Only', 'Bodyweight', 'Resistance Bands'].map(eq => (
                        <button
                          key={eq}
                          onClick={() => setEquipment(eq)}
                          className={`p-3 text-sm rounded-xl border transition-all ${equipment === eq ? 'bg-secondary/20 border-secondary text-secondary font-medium' : 'bg-black/20 border-white/5 text-slate-300 hover:bg-white/5'}`}
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
                  <Apple className="h-5 w-5 text-accent" />
                  <h2 className="text-lg font-medium text-white">Dietary Preferences</h2>
                </div>
                
                <div className="grid gap-4">
                  {['No restrictions', 'Vegetarian', 'Vegan', 'Keto', 'Paleo'].map(diet => (
                    <button
                      key={diet}
                      onClick={() => setDietPref(diet)}
                      className={`text-left p-4 rounded-xl border transition-all ${dietPref === diet ? 'bg-accent/20 border-accent text-accent font-medium shadow-glow shadow-accent/20' : 'bg-black/20 border-white/5 text-slate-300 hover:bg-white/5'}`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col items-center justify-center text-center h-full animate-in zoom-in-95 duration-500 py-12">
                <div className="h-20 w-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 shadow-glow border border-primary/30">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-display font-semibold text-white mb-2">Plans Generated!</h2>
                <p className="text-muted-foreground max-w-sm mb-8">
                  Your custom AI workout and diet plans have been saved to your dashboard.
                </p>
                <button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors"
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
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-white transition-colors disabled:opacity-0"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                
                {step < 3 ? (
                  <button 
                    onClick={() => setStep(step + 1 as WizardStep)}
                    className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button 
                    onClick={generatePlan}
                    disabled={isGenerating}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isGenerating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><Settings className="h-4 w-4" /> Generate Plans</>}
                  </button>
                )}
              </div>
            )}
          </BentoCard>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-1">
          <BentoCard className="h-full bg-card/40 border-dashed relative overflow-hidden">
            {/* Ambient Background Glow based on goal */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 blur-[80px] rounded-full opacity-30 pointer-events-none transition-colors duration-1000 ${goal === 'weight_loss' ? 'bg-secondary' : goal === 'muscle_gain' ? 'bg-primary' : 'bg-accent'}`} />
            
            <div className="flex items-center gap-2 mb-6">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Live Preview</h3>
            </div>

            <div className="space-y-6 relative z-10">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Target Calories</p>
                <p className="text-3xl font-display font-bold text-white tracking-tight">{previewTargets.calorieTarget} <span className="text-sm text-muted-foreground font-normal">kcal</span></p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="text-[10px] text-muted-foreground uppercase mb-1">Protein</p>
                  <p className="text-lg font-semibold text-white">{previewTargets.proteinTarget}g</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="text-[10px] text-muted-foreground uppercase mb-1">Carbs</p>
                  <p className="text-lg font-semibold text-white">{previewTargets.carbohydrateTarget}g</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <p className="text-xs text-muted-foreground mb-3">AI Plan Parameters</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Experience</span>
                    <span className="text-white font-medium">{experience}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Equipment</span>
                    <span className="text-white font-medium truncate max-w-[120px] text-right">{equipment}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Diet</span>
                    <span className="text-white font-medium">{dietPref}</span>
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
