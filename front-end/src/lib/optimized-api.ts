"use server"

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";

// Cache durations in seconds
const CACHE_DURATIONS = {
  STATIC: 3600,    // 1 hour for rarely changing data
  DYNAMIC: 300,    // 5 minutes for frequently changing data
  REALTIME: 30     // 30 seconds for real-time data
};

/**
 * Optimized fetch with intelligent caching and error handling
 */
export async function fetchWithCache(
  endpoint: string, 
  cacheStrategy: 'static' | 'dynamic' | 'realtime' = 'dynamic',
  options: RequestInit = {}
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
  
  const cacheTime = CACHE_DURATIONS[cacheStrategy.toUpperCase() as keyof typeof CACHE_DURATIONS];
  
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",  
        "Authorization": `Bearer ${token}`,
        ...options.headers
      },
      next: { 
        revalidate: cacheTime,
        tags: [endpoint.split('/')[2] || 'api'] // Tag by resource type
      },
      ...options
    });
    
    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    
    return res.json();
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Get apartments with server-side filtering for agents
 */
export async function getApartmentsOptimized(userId?: string, summary = false) {
  const params = new URLSearchParams();
  if (userId) params.append('userId', userId);
  if (summary) params.append('summary', 'true');
  
  const endpoint = `/api/apartments${params.toString() ? `?${params.toString()}` : ''}`;
  return fetchWithCache(endpoint, summary ? 'dynamic' : 'static');
}

/**
 * Batch API calls for dashboard with parallel execution
 */
export async function fetchDashboardDataOptimized(userId?: string) {
  try {
    // Parallel API calls instead of sequential
    const [
      apartments,
      recentActivity,
      topAgents,
      monthlyTarget
    ] = await Promise.all([
      getApartmentsOptimized(userId, true), // Summary data only
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
    // Return empty data instead of throwing to prevent page crashes
    return {
      apartments: [],
      recentActivity: [],
      topAgents: [],
      monthlyTarget: null
    };
  }
}

/**
 * Get projects with caching (for modals)
 */
export async function getProjectsOptimized() {
  return fetchWithCache('/api/projects', 'static');
}

/**
 * Get clients with caching
 */
export async function getClientsOptimized() {
  return fetchWithCache('/api/clients', 'dynamic');
}

/**
 * Optimized form submission with proper error handling
 */
export async function submitFormOptimized(
  endpoint: string,
  formData: FormData,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST'
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
  
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Form submission error for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Debounced search function to prevent excessive API calls
 */
let searchTimeout: NodeJS.Timeout;
export function debouncedSearch(
  searchTerm: string,
  searchFunction: (term: string) => Promise<any>,
  delay = 300
): Promise<any> {
  return new Promise((resolve, reject) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
      try {
        const result = await searchFunction(searchTerm);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, delay);
  });
}
