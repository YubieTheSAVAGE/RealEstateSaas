"use client";
import React, { useEffect, useState } from 'react';

interface RequestLog {
  id: string;
  url: string;
  method: string;
  timestamp: Date;
  duration?: number;
  status?: number;
  cached?: boolean;
}

// Development-only request monitoring
export default function RequestMonitor() {
  const [requests, setRequests] = useState<RequestLog[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    // Override fetch to monitor requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = Date.now();
      const requestId = Math.random().toString(36).substr(2, 9);
      const url = args[0] as string;
      const options = args[1] as RequestInit;
      
      // Log request start
      const requestLog: RequestLog = {
        id: requestId,
        url,
        method: options?.method || 'GET',
        timestamp: new Date(),
      };
      
      setRequests(prev => [requestLog, ...prev.slice(0, 49)]); // Keep last 50 requests
      
      try {
        const response = await originalFetch(...args);
        const duration = Date.now() - startTime;
        
        // Update request with response info
        setRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, duration, status: response.status, cached: response.headers.get('x-cache') === 'HIT' }
            : req
        ));
        
        return response;
      } catch (error) {
        const duration = Date.now() - startTime;
        setRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, duration, status: 0 }
            : req
        ));
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  const duplicateRequests = requests.filter((req, index, arr) => 
    arr.findIndex(r => r.url === req.url && r.method === req.method) !== index
  );

  const slowRequests = requests.filter(req => (req.duration || 0) > 1000);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`px-3 py-2 rounded-lg text-white text-sm font-medium ${
          duplicateRequests.length > 0 || slowRequests.length > 0 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        API Monitor ({requests.length})
        {duplicateRequests.length > 0 && (
          <span className="ml-1 px-1 bg-red-700 rounded text-xs">
            {duplicateRequests.length} dups
          </span>
        )}
      </button>

      {isVisible && (
        <div className="absolute bottom-12 right-0 w-96 max-h-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white">API Requests</h3>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {duplicateRequests.length > 0 && (
                <span className="text-red-500">⚠️ {duplicateRequests.length} duplicate requests</span>
              )}
              {slowRequests.length > 0 && (
                <span className="text-orange-500 ml-2">🐌 {slowRequests.length} slow requests</span>
              )}
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {requests.map((req) => (
              <div 
                key={req.id} 
                className={`p-2 border-b border-gray-100 dark:border-gray-700 text-xs ${
                  duplicateRequests.some(d => d.id === req.id) ? 'bg-red-50 dark:bg-red-900/20' :
                  (req.duration || 0) > 1000 ? 'bg-orange-50 dark:bg-orange-900/20' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white truncate">
                      {req.method} {req.url.replace(process.env.NEXT_PUBLIC_API_URL || '', '')}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {req.timestamp.toLocaleTimeString()}
                      {req.duration && ` • ${req.duration}ms`}
                      {req.cached && ' • cached'}
                    </div>
                  </div>
                  <div className={`px-1 rounded text-xs ${
                    req.status === undefined ? 'bg-gray-100 text-gray-600' :
                    req.status >= 200 && req.status < 300 ? 'bg-green-100 text-green-700' :
                    req.status >= 400 ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {req.status || 'pending'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setRequests([])}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear logs
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
