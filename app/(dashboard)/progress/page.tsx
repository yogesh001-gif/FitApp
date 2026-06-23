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

    // Grab oldest and newest photo for a simple comparison
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-semibold text-white">Log Metrics</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Track body measurements</p>
          </div>
        </div>

        <form onSubmit={handleLogSubmit} className="space-y-4">
          <div className="space-y-3">
            <input name="weightKg" type="number" step="0.1" placeholder="Weight (kg)" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <div className="grid grid-cols-2 gap-3">
              <input name="waistCm" type="number" step="0.1" placeholder="Waist (cm)" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <input name="chestCm" type="number" step="0.1" placeholder="Chest (cm)" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input name="armsCm" type="number" step="0.1" placeholder="Arms (cm)" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <input name="hipsCm" type="number" step="0.1" placeholder="Hips (cm)" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLogLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-4 font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLogLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> Saving...</> : <><Save className="h-5 w-5" /> Save Progress</>}
          </button>

          {logSuccess && (
            <div className="flex items-center gap-2 text-primary bg-primary/10 p-3 rounded-xl border border-primary/20 animate-in fade-in">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">Metrics saved successfully!</span>
            </div>
          )}
          {logError && (
            <div className="flex items-start gap-2 text-destructive bg-destructive/10 p-3 rounded-xl border border-destructive/20 animate-in fade-in">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span className="text-sm">{logError}</span>
            </div>
          )}
        </form>
      </BentoCard>

      {/* Photo Upload */}
      <BentoCard delay={0.2} gradient="secondary">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/20 text-secondary border border-secondary/30">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-semibold text-white">Upload Photos</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Visual progress tracking</p>
          </div>
        </div>

        <form onSubmit={handlePhotoSubmit} className="space-y-4">
          <div className="space-y-3">
            <select name="angle" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-secondary/50 appearance-none">
              <option value="front" className="bg-card">Front View</option>
              <option value="side" className="bg-card">Side View</option>
              <option value="back" className="bg-card">Back View</option>
            </select>
            
            <div className="relative group cursor-pointer">
              <input name="photo" type="file" accept="image/*" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="w-full rounded-2xl border-2 border-dashed border-white/20 bg-black/10 px-4 py-12 text-center transition-colors group-hover:border-secondary/50 group-hover:bg-secondary/5">
                <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-3 group-hover:text-secondary transition-colors" />
                <p className="text-sm text-white font-medium mb-1">Click to browse or drag image here</p>
                <p className="text-xs text-muted-foreground">Supports JPG, PNG, WEBP</p>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPhotoLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-secondary text-secondary-foreground px-5 py-4 font-medium hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isPhotoLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> Uploading...</> : <><Upload className="h-5 w-5" /> Upload Photo</>}
          </button>

          {photoSuccess && (
            <div className="flex items-center gap-2 text-secondary bg-secondary/10 p-3 rounded-xl border border-secondary/20 animate-in fade-in">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">Photo uploaded successfully!</span>
            </div>
          )}
          {photoError && (
            <div className="flex items-start gap-2 text-destructive bg-destructive/10 p-3 rounded-xl border border-destructive/20 animate-in fade-in">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span className="text-sm">{photoError}</span>
            </div>
          )}
        </form>
      </BentoCard>

      {/* Trend Charts */}
      <div className="lg:col-span-2">
        <BentoCard delay={0.3}>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent border border-accent/30">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-white">Body Trends</h2>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Metrics over time</p>
            </div>
          </div>

          {isHistoryLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : historyData.length < 2 ? (
            <div className="text-center p-12 rounded-2xl border border-dashed border-white/10 bg-black/20">
              <p className="text-muted-foreground">Log more metrics to see your trends over time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Weight Chart */}
              <div className="h-64">
                <h3 className="text-sm text-white mb-4 flex items-center gap-2"><Scale className="h-4 w-4 text-accent" /> Weight Trend (kg)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="weightKg" stroke="#eab308" strokeWidth={3} dot={{ fill: '#eab308', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Measurements Chart */}
              <div className="h-64">
                <h3 className="text-sm text-white mb-4 flex items-center gap-2"><Ruler className="h-4 w-4 text-primary" /> Chest & Waist (cm)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="chestCm" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2 }} activeDot={{ r: 6 }} name="Chest" />
                    <Line type="monotone" dataKey="waistCm" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2 }} activeDot={{ r: 6 }} name="Waist" />
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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30">
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-display font-semibold text-white">Photo Gallery</h2>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Your progress over time</p>
              </div>
            </div>

            {photos.length >= 2 && (
              <button 
                onClick={runAiAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Analyze Progress
              </button>
            )}
          </div>

          {aiAnalysis && (
            <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">AI Vision Analysis</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{aiAnalysis}</p>
            </div>
          )}

          {isGalleryLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center p-12 rounded-2xl border border-dashed border-white/10 bg-black/20">
              <p className="text-muted-foreground">No photos uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div key={photo._id} className="relative group rounded-xl overflow-hidden aspect-[3/4] bg-black/40 border border-white/10">
                  <Image 
                    src={photo.url} 
                    alt={`Progress photo - ${photo.angle}`} 
                    fill 
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-white capitalize font-medium">{photo.angle} View</p>
                        <p className="text-[10px] text-white/70">{format(new Date(photo.takenAt), 'MMM d, yyyy')}</p>
                      </div>
                      {index === 0 && <span className="px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded text-[10px] uppercase font-bold">New</span>}
                      {index === photos.length - 1 && photos.length > 1 && <span className="px-2 py-0.5 bg-white/20 text-white border border-white/30 rounded text-[10px] uppercase font-bold">Before</span>}
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
