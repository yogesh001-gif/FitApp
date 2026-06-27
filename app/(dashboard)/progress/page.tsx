'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { BentoCard } from '../../../components/dashboard/bento-card';
import { TrendingUp, Camera, Loader2, CheckCircle2, AlertCircle, Save, Upload, Sparkles, Scale, Activity, Ruler } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type ProgressPhoto = {
  _id: string;
  url: string;
  angle: string;
  takenAt: string;
};

export default function ProgressPage() {
  const [isLogLoading, setIsLogLoading] = useState(false);
  const [logSuccess, setLogSuccess] = useState(false);
  const [logError, setLogError] = useState<string | null>(null);

  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [photoSuccess, setPhotoSuccess] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState(true);
  
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [photoRes, historyRes] = await Promise.all([
        fetch('/api/upload/progress-photo'),
        fetch('/api/progress/history')
      ]);

      if (photoRes.ok) {
        const data = await photoRes.json();
        setPhotos(data.photos || []);
      }
      
      if (historyRes.ok) {
        const data = await historyRes.json();
        const formattedHistory = data.history.map((h: any) => ({
          ...h,
          date: format(new Date(h.createdAt), 'MMM d')
        }));
        setHistoryData(formattedHistory);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setIsGalleryLoading(false);
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsLogLoading(true);
    setLogError(null);
    setLogSuccess(false);

    try {
      const formData = new FormData(form);
      const res = await fetch('/api/progress', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save progress');
      }

      setLogSuccess(true);
      form.reset();
      fetchData(); // Refresh charts
      setTimeout(() => setLogSuccess(false), 3000);
    } catch (err: any) {
      setLogError(err.message);
    } finally {
      setIsLogLoading(false);
    }
  };

  const handlePhotoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsPhotoLoading(true);
    setPhotoError(null);
    setPhotoSuccess(false);

    try {
      const formData = new FormData(form);
      const res = await fetch('/api/upload/progress-photo', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to upload photo');
      }

      setPhotoSuccess(true);
      form.reset();
      fetchData();
      setTimeout(() => setPhotoSuccess(false), 3000);
    } catch (err: any) {
      setPhotoError(err.message);
    } finally {
      setIsPhotoLoading(false);
    }
  };

  const runAiAnalysis = async () => {
    if (photos.length < 2) return;
    setIsAnalyzing(true);
    setAiAnalysis(null);

    const oldest = photos[photos.length - 1];
    const newest = photos[0];

    try {
      const res = await fetch('/api/progress/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beforePhotoUrl: oldest.url,
          afterPhotoUrl: newest.url
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAiAnalysis(data.analysis);
    } catch (err: any) {
      console.error(err);
      setAiAnalysis("Analysis failed to run.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto">
      
      {/* Metrics Log */}
      <BentoCard delay={0.1}>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight">Log Metrics</h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Track body measurements</p>
          </div>
        </div>

        <form onSubmit={handleLogSubmit} className="space-y-4">
          <div className="space-y-3">
            <input name="weightKg" type="number" step="0.1" placeholder="Weight (kg)" className="w-full rounded-xl border border-white/[0.06] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/[0.15] focus:bg-black/60 transition-colors" />
            <div className="grid grid-cols-2 gap-3">
              <input name="waistCm" type="number" step="0.1" placeholder="Waist (cm)" className="w-full rounded-xl border border-white/[0.06] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/[0.15] focus:bg-black/60 transition-colors" />
              <input name="chestCm" type="number" step="0.1" placeholder="Chest (cm)" className="w-full rounded-xl border border-white/[0.06] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/[0.15] focus:bg-black/60 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input name="armsCm" type="number" step="0.1" placeholder="Arms (cm)" className="w-full rounded-xl border border-white/[0.06] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/[0.15] focus:bg-black/60 transition-colors" />
              <input name="hipsCm" type="number" step="0.1" placeholder="Hips (cm)" className="w-full rounded-xl border border-white/[0.06] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-white/[0.15] focus:bg-black/60 transition-colors" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLogLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-black px-5 py-3 text-sm font-medium hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLogLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Progress</>}
          </button>

          {logSuccess && (
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-medium">Metrics saved successfully!</span>
            </div>
          )}
          {logError && (
            <div className="flex items-start gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="text-xs">{logError}</span>
            </div>
          )}
        </form>
      </BentoCard>

      {/* Photo Upload */}
      <BentoCard delay={0.2}>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Camera className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight">Upload Photos</h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Visual progress tracking</p>
          </div>
        </div>

        <form onSubmit={handlePhotoSubmit} className="space-y-4">
          <div className="space-y-3">
            <select name="angle" className="w-full rounded-xl border border-white/[0.06] bg-black/40 px-4 py-3 text-sm text-white focus:outline-none focus:border-white/[0.15] focus:bg-black/60 transition-colors appearance-none">
              <option value="front" className="bg-slate-900">Front View</option>
              <option value="side" className="bg-slate-900">Side View</option>
              <option value="back" className="bg-slate-900">Back View</option>
            </select>
            
            <div className="relative group cursor-pointer">
              <input name="photo" type="file" accept="image/*" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="w-full rounded-xl border border-dashed border-white/[0.15] bg-white/[0.02] px-4 py-12 text-center transition-colors group-hover:border-white/[0.3] group-hover:bg-white/[0.04]">
                <Camera className="h-6 w-6 text-slate-500 mx-auto mb-3 group-hover:text-slate-400 transition-colors" />
                <p className="text-xs text-white font-medium mb-1">Click to browse or drag image here</p>
                <p className="text-[10px] text-slate-500">Supports JPG, PNG, WEBP</p>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPhotoLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-black px-5 py-3 text-sm font-medium hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isPhotoLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</> : <><Upload className="h-4 w-4" /> Upload Photo</>}
          </button>

          {photoSuccess && (
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-medium">Photo uploaded successfully!</span>
            </div>
          )}
          {photoError && (
            <div className="flex items-start gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="text-xs">{photoError}</span>
            </div>
          )}
        </form>
      </BentoCard>

      {/* Trend Charts */}
      <div className="lg:col-span-2">
        <BentoCard delay={0.3}>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Activity className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight">Body Trends</h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Metrics over time</p>
            </div>
          </div>

          {isHistoryLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
            </div>
          ) : historyData.length < 2 ? (
            <div className="text-center p-12 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.02]">
              <p className="text-xs text-slate-500">Log more metrics to see your trends over time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Weight Chart */}
              <div className="h-60">
                <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Scale className="h-3 w-3" /> Weight Trend (kg)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dx={-10} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} 
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="weightKg" stroke="#34d399" strokeWidth={2} dot={{ fill: '#34d399', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Measurements Chart */}
              <div className="h-60">
                <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Ruler className="h-3 w-3" /> Chest & Waist (cm)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} dx={-10} domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="chestCm" stroke="#38bdf8" strokeWidth={2} dot={{ fill: '#38bdf8', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} name="Chest" />
                    <Line type="monotone" dataKey="waistCm" stroke="#fbbf24" strokeWidth={2} dot={{ fill: '#fbbf24', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} name="Waist" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </BentoCard>
      </div>
      
      {/* AI Comparison & Photo Gallery */}
      <div className="lg:col-span-2">
        <BentoCard delay={0.4}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20">
                <Camera className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white tracking-tight">Photo Gallery</h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Your progress over time</p>
              </div>
            </div>

            {photos.length >= 2 && (
              <button 
                onClick={runAiAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                {isAnalyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                Analyze Progress
              </button>
            )}
          </div>

          {aiAnalysis && (
            <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center gap-2 mb-2 text-purple-400">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">AI Vision Analysis</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{aiAnalysis}</p>
            </div>
          )}

          {isGalleryLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center p-12 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.02]">
              <p className="text-xs text-slate-500">No photos uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {photos.map((photo, index) => (
                <div key={photo._id} className="relative group rounded-xl overflow-hidden aspect-[3/4] bg-slate-900 border border-white/[0.06]">
                  <Image 
                    src={photo.url} 
                    alt={`Progress photo - ${photo.angle}`} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-white capitalize font-medium">{photo.angle} View</p>
                        <p className="text-[10px] text-white/50">{format(new Date(photo.takenAt), 'MMM d, yyyy')}</p>
                      </div>
                      {index === 0 && <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[9px] uppercase font-bold">New</span>}
                      {index === photos.length - 1 && photos.length > 1 && <span className="px-1.5 py-0.5 bg-white/10 text-slate-300 border border-white/20 rounded text-[9px] uppercase font-bold">Before</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </BentoCard>
      </div>
      
    </div>
  );
}
