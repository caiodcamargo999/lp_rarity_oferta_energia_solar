// Performance optimization utilities

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload critical images
  const criticalImages = ['/rarity_logo.png']
  
  criticalImages.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  })
}

// Lazy load non-critical images
export const lazyLoadImages = () => {
  const images = document.querySelectorAll('img[data-src]')
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        img.src = img.dataset.src!
        img.classList.remove('lazy')
        observer.unobserve(img)
      }
    })
  })
  
  images.forEach(img => imageObserver.observe(img))
}

// Optimize animations for performance
export const optimizeAnimations = () => {
  // Reduce motion for users who prefer it
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.1s')
  }
  
  // Use requestAnimationFrame for smooth animations
  let ticking = false
  
  const updateAnimations = () => {
    ticking = false
    // Animation logic here
  }
  
  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateAnimations)
      ticking = true
    }
  }
  
  return requestTick
}

// Performance monitoring
export const monitorPerformance = () => {
  if ('performance' in window) {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime)
        }
        if (entry.entryType === 'first-input') {
          const fidEntry = entry as any
          if (fidEntry.processingStart) {
            console.log('FID:', fidEntry.processingStart - entry.startTime)
          }
        }
      }
    })
    
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] })
  }
}

// Debounce function for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function for performance
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
