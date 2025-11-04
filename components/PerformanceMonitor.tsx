'use client'

import { useEffect, useState } from 'react'

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0
  })

  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const fcp = entries[entries.length - 1]
        if (fcp) {
          setMetrics(prev => ({ ...prev, fcp: Math.round(fcp.startTime) }))
        }
      })
      fcpObserver.observe({ entryTypes: ['paint'] })

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lcp = entries[entries.length - 1]
        if (lcp) {
          setMetrics(prev => ({ ...prev, lcp: Math.round(lcp.startTime) }))
        }
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const fid = entries[entries.length - 1] as PerformanceEventTiming
        if (fid && 'processingStart' in fid) {
          setMetrics(prev => ({ 
            ...prev, 
            fid: Math.round(fid.processingStart - fid.startTime) 
          }))
        }
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as any
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value || 0
          }
        }
        setMetrics(prev => ({ ...prev, cls: Math.round(clsValue * 1000) / 1000 }))
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      // Time to First Byte
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigationEntry) {
        setMetrics(prev => ({ 
          ...prev, 
          ttfb: Math.round(navigationEntry.responseStart - navigationEntry.requestStart) 
        }))
      }

      return () => {
        fcpObserver.disconnect()
        lcpObserver.disconnect()
        fidObserver.disconnect()
        clsObserver.disconnect()
      }
    }
  }, [])

  // Only show in development or when explicitly enabled
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SHOW_PERF) {
    return null
  }

  return (
    <div className="perf-indicator visible">
      <div className="text-xs font-mono">
        <div>FCP: {metrics.fcp}ms</div>
        <div>LCP: {metrics.lcp}ms</div>
        <div>FID: {metrics.fid}ms</div>
        <div>CLS: {metrics.cls}</div>
        <div>TTFB: {metrics.ttfb}ms</div>
      </div>
    </div>
  )
}
