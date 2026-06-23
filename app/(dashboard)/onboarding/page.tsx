'use client';

import { useState } from 'react';
import { submitOnboarding } from '../../actions/onboarding';
import { BentoCard } from '../../../components/dashboard/bento-card';
import { User, Activity, Target, Save, ChevronRight, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    heightCm: '',
    weightKg: '',
    goal: 'weight_loss',
    activityLevel: 'moderately_active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const res = await submitOnboarding(data);
      if (res?.error) {
        setError(res.error);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto pt-10">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-semibold text-white mb-2">Welcome to Fitapp</h1>
        <p className="text-muted-foreground">Let's set up your profile to generate your custom targets.</p>
        
        <div className="flex gap-2 mt-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-primary' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      <BentoCard className="min-h-[400px] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-primary/20 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-medium text-white">Basic Info</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">What's your name?</label>
                  <input required value={formData.name} onChange={e => updateField('name', e.target.value)} placeholder="Name" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">Age</label>
                    <input required type="number" min="13" max="100" value={formData.age} onChange={e => updateField('age', e.target.value)} placeholder="Age" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">Gender</label>
                    <select required value={formData.gender} onChange={e => updateField('gender', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none appearance-none">
                      <option value="male" className="bg-card">Male</option>
                      <option value="female" className="bg-card">Female</option>
                      <option value="non_binary" className="bg-card">Non-binary</option>
                      <option value="prefer_not_to_say" className="bg-card">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-secondary/20 text-secondary">
                  <Activity className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-medium text-white">Body Metrics</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Height (cm)</label>
                  <input required type="number" min="80" max="250" value={formData.heightCm} onChange={e => updateField('heightCm', e.target.value)} placeholder="e.g. 175" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:ring-2 focus:ring-secondary/50 outline-none" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Weight (kg)</label>
                  <input required type="number" min="30" max="300" step="0.1" value={formData.weightKg} onChange={e => updateField('weightKg', e.target.value)} placeholder="e.g. 75" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:ring-2 focus:ring-secondary/50 outline-none" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-accent/20 text-accent">
                  <Target className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-medium text-white">Goals & Activity</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Primary Goal</label>
                  <select required value={formData.goal} onChange={e => updateField('goal', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:ring-2 focus:ring-accent/50 outline-none appearance-none">
                    <option value="weight_loss" className="bg-card">Weight Loss</option>
                    <option value="muscle_gain" className="bg-card">Muscle Gain</option>
                    <option value="body_recomposition" className="bg-card">Body Recomposition</option>
                    <option value="maintenance" className="bg-card">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Activity Level</label>
                  <select required value={formData.activityLevel} onChange={e => updateField('activityLevel', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:ring-2 focus:ring-accent/50 outline-none appearance-none">
                    <option value="sedentary" className="bg-card">Sedentary (Little or no exercise)</option>
                    <option value="lightly_active" className="bg-card">Lightly Active (Light exercise 1-3 days/week)</option>
                    <option value="moderately_active" className="bg-card">Moderately Active (Moderate exercise 3-5 days/week)</option>
                    <option value="very_active" className="bg-card">Very Active (Hard exercise 6-7 days/week)</option>
                    <option value="athlete" className="bg-card">Athlete (Very hard exercise/physical job)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in zoom-in-95 duration-500 flex-1 flex flex-col items-center justify-center text-center">
              <div className="h-20 w-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 shadow-glow border border-primary/30">
                <Save className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-semibold text-white mb-2">Ready to Go!</h2>
              <p className="text-muted-foreground max-w-sm mb-6">
                We have enough information to configure your dashboard and personalized AI features.
              </p>

              {error && (
                <div className="flex items-start gap-2 text-destructive bg-destructive/10 p-3 rounded-xl border border-destructive/20 mb-6 w-full text-left">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
            {step > 1 ? (
              <button 
                type="button" 
                onClick={handleBack} 
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-white transition-colors"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button 
                type="button" 
                onClick={handleNext}
                disabled={step === 1 && !formData.name || step === 1 && !formData.age || step === 2 && !formData.heightCm || step === 2 && !formData.weightKg}
                className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" /> Saving Profile...</> : "Complete Onboarding"}
              </button>
            )}
          </div>
        </form>
      </BentoCard>
    </div>
  );
}
