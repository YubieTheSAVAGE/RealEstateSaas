import React, { Suspense } from "react";
import { fetchDashboardData } from "@/lib/api-cache";
import { FallingLines } from "react-loader-spinner";

// Lazy load heavy components
const MonthlySalesChart = React.lazy(() => import("@/components/ecommerce/MonthlySalesChart"));
const PerformingAgents = React.lazy(() => import("@/components/ecommerce/TopPerformingAgents"));

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <FallingLines height="60" width="60" color="#4460FF" visible={true} />
    </div>
  );
}

// Server component for better performance
export default async function OptimizedHomePage() {
  // Fetch all data on server side
  const dashboardData = await fetchDashboardData();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Stats Cards - Server rendered */}
      <div className="col-span-full">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Total Properties" 
            value={dashboardData.apartments.total}
            change="+12%"
          />
          <StatsCard 
            title="Available" 
            value={dashboardData.apartments.available}
            change="+5%"
          />
          <StatsCard 
            title="Sold This Month" 
            value={dashboardData.apartments.soldThisMonth}
            change="+18%"
          />
          <StatsCard 
            title="Revenue" 
            value={`$${dashboardData.apartments.totalRevenue.toLocaleString()}`}
            change="+25%"
          />
        </div>
      </div>

      {/* Charts - Lazy loaded */}
      <div className="lg:col-span-2">
        <Suspense fallback={<LoadingSpinner />}>
          <MonthlySalesChart properties={dashboardData.apartments} />
        </Suspense>
      </div>

      <div>
        <Suspense fallback={<LoadingSpinner />}>
          <PerformingAgents />
        </Suspense>
      </div>

      {/* Recent Activity - Server rendered */}
      <div className="col-span-full lg:col-span-2">
        <RecentActivityOptimized activities={dashboardData.recentActivity} />
      </div>

      {/* Monthly Target - Server rendered */}
      <div>
        <MonthlyTargetOptimized target={dashboardData.monthlyTarget} />
      </div>
    </div>
  );
}

// Optimized components that don't re-fetch data
function StatsCard({ title, value, change }: { title: string; value: string | number; change: string }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        <p className="ml-2 text-sm font-medium text-green-600">{change}</p>
      </div>
    </div>
  );
}

function RecentActivityOptimized({ activities }: { activities: any[] }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">
                  {activity.project?.name?.[0] || 'P'}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white truncate">
                Apartment {activity.number} - {activity.status}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activity.project?.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyTargetOptimized({ target }: { target: any }) {
  const progress = target ? (target.achieved / target.target) * 100 : 0;
  
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Target</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Target</span>
          <span className="text-sm font-medium">${target?.target?.toLocaleString() || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Achieved</span>
          <span className="text-sm font-medium">${target?.achieved?.toLocaleString() || 0}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500">{progress.toFixed(1)}% complete</p>
      </div>
    </div>
  );
}
