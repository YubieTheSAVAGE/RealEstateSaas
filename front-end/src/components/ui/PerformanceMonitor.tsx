"use client";
import { useEffect } from 'react';

interface PerformanceMonitorProps {
  enabled?: boolean;
}

export default function PerformanceMonitor({ enabled = process.env.NODE_ENV === 'development' }: PerformanceMonitorProps) {
  useEffect(() => {
    if (!enabled) return;

    // Monitor navigation performance
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log('🚀 Navigation Performance:', {
            'DNS Lookup': navEntry.domainLookupEnd - navEntry.domainLookupStart,
            'TCP Connection': navEntry.connectEnd - navEntry.connectStart,
            'Request': navEntry.responseStart - navEntry.requestStart,
            'Response': navEntry.responseEnd - navEntry.responseStart,
            'DOM Processing': navEntry.domContentLoadedEventEnd - navEntry.responseEnd,
            'Total Load Time': navEntry.loadEventEnd - navEntry.navigationStart,
          });
        }
        
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('🎨 LCP (Largest Contentful Paint):', entry.startTime + 'ms');
        }
        
        if (entry.entryType === 'first-input') {
          console.log('⚡ FID (First Input Delay):', entry.processingStart - entry.startTime + 'ms');
        }
      }
    });

    // Observe different performance metrics
    observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint', 'first-input'] });

    // Monitor bundle size
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      console.log('📡 Network Info:', {
        'Effective Type': connection.effectiveType,
        'Downlink': connection.downlink + ' Mbps',
        'RTT': connection.rtt + 'ms',
      });
    }

    return () => observer.disconnect();
  }, [enabled]);

  return null;
}
