// Optimized API caching strategy

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";

// Cache configuration
const CACHE_DURATIONS = {
  STATIC: 3600,      // 1 hour for static data
  DYNAMIC: 300,      // 5 minutes for dynamic data
  REALTIME: 60,      // 1 minute for real-time data
};

/**
 * Optimized fetch with intelligent caching
 */
export async function fetchWithCache(
  endpoint: string, 
  cacheStrategy: 'static' | 'dynamic' | 'realtime' = 'dynamic'
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
  
  const cacheTime = CACHE_DURATIONS[cacheStrategy.toUpperCase() as keyof typeof CACHE_DURATIONS];
  
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",  
      "Authorization": `Bearer ${token}` 
    },
    next: { 
      revalidate: cacheTime,
      tags: [endpoint.split('/')[1]] // Tag by resource type
    }
  });
  
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Batch API calls for dashboard
 */
export async function fetchDashboardData() {
  try {
    // Parallel API calls instead of sequential
    const [
      apartments,
      recentActivity,
      topAgents,
      monthlyTarget
    ] = await Promise.all([
      fetchWithCache('/api/apartments?summary=true', 'dynamic'), // Only summary data
      fetchWithCache('/api/activity/recent?limit=5', 'realtime'),
      fetchWithCache('/api/agents/top-performing?limit=5', 'dynamic'),
      fetchWithCache('/api/monthly-target', 'static')
    ]);

    return {
      apartments,
      recentActivity,
      topAgents,
      monthlyTarget
    };
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    throw error;
  }
}

/**
 * Optimized apartment fetching with pagination
 */
export async function fetchApartmentsPaginated(
  page = 1, 
  limit = 20, 
  filters: Record<string, any> = {}
) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters
  });

  return fetchWithCache(`/api/apartments?${queryParams}`, 'dynamic');
}
