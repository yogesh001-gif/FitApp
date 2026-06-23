import { BentoCard } from '../../components/dashboard/bento-card';

export default function DashboardLoading() {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-6 lg:grid-cols-12 auto-rows-[minmax(180px,auto)] max-w-7xl mx-auto animate-pulse">
      
      {/* Top Banner Skeleton */}
      <div className="col-span-full">
        <BentoCard className="h-40 flex items-center justify-between overflow-hidden">
          <div className="space-y-4 w-1/2">
            <div className="h-8 w-48 bg-white/10 rounded-lg"></div>
            <div className="h-4 w-64 bg-white/5 rounded-md"></div>
          </div>
          <div className="h-24 w-24 rounded-full bg-white/5"></div>
        </BentoCard>
      </div>

      {/* Stats Row Skeleton */}
      <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <BentoCard key={i} className="h-32">
            <div className="flex justify-between items-start mb-4">
              <div className="h-6 w-20 bg-white/10 rounded-md"></div>
              <div className="h-8 w-8 bg-white/10 rounded-xl"></div>
            </div>
            <div className="h-8 w-16 bg-white/20 rounded-lg"></div>
          </BentoCard>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="col-span-1 md:col-span-6 lg:col-span-8">
        <BentoCard className="h-96">
          <div className="h-6 w-32 bg-white/10 rounded-md mb-6"></div>
          <div className="space-y-4">
            <div className="h-16 w-full bg-white/5 rounded-xl"></div>
            <div className="h-16 w-full bg-white/5 rounded-xl"></div>
            <div className="h-16 w-full bg-white/5 rounded-xl"></div>
            <div className="h-16 w-full bg-white/5 rounded-xl"></div>
          </div>
        </BentoCard>
      </div>

      {/* Sidebar Content Skeleton */}
      <div className="col-span-1 md:col-span-6 lg:col-span-4">
        <BentoCard className="h-96 flex flex-col justify-center items-center">
          <div className="h-40 w-40 rounded-full bg-white/10 mb-8 border-4 border-white/5"></div>
          <div className="h-4 w-24 bg-white/10 rounded-md mb-4"></div>
          <div className="h-4 w-32 bg-white/5 rounded-md"></div>
        </BentoCard>
      </div>

    </div>
  );
}
