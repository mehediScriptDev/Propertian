/**
 * Performance Monitoring Utilities
 * Track Core Web Vitals and custom metrics
 */

/**
 * Report Web Vitals to analytics
 * @param {Object} metric - Web vital metric object
 */
export function reportWebVitals(metric) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(
        metric.name === 'CLS' ? metric.value * 1000 : metric.value
      ),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${metric.name}]:`, metric.value);
  }
}

/**
 * Measure component render time
 * @param {string} componentName - Name of the component
 * @returns {Function} - Cleanup function
 */
export function measureRenderTime(componentName) {
  const startTime = performance.now();

  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[Render Time] ${componentName}:`,
        `${renderTime.toFixed(2)}ms`
      );
    }

    // Track slow renders (> 16ms for 60fps)
    if (renderTime > 16) {
      console.warn(
        `[Slow Render] ${componentName}:`,
        `${renderTime.toFixed(2)}ms`
      );
    }
  };
}

/**
 * Lazy load images with IntersectionObserver
 * @param {string} selector - CSS selector for images
 */
export function lazyLoadImages(selector = 'img[data-src]') {
  if (typeof window === 'undefined') return;

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');

        if (src) {
          img.setAttribute('src', src);
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });

  const images = document.querySelectorAll(selector);
  images.forEach((img) => imageObserver.observe(img));

  return () => {
    images.forEach((img) => imageObserver.unobserve(img));
  };
}

/**
 * Debounce function for input handlers
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll handlers
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export function throttle(func, limit = 100) {
  let inThrottle;

  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Preload critical resources
 * @param {Array<string>} urls - URLs to preload
 * @param {string} type - Resource type (image, font, etc.)
 */
export function preloadResources(urls, type = 'image') {
  if (typeof document === 'undefined') return;

  urls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = type;
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Measure API call performance
 * @param {Function} apiCall - API call function
 * @param {string} endpoint - Endpoint name
 * @returns {Promise} - API response
 */
export async function measureApiCall(apiCall, endpoint) {
  const startTime = performance.now();

  try {
    const result = await apiCall();
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Call] ${endpoint}:`, `${duration.toFixed(2)}ms`);
    }

    // Track slow API calls (> 1000ms)
    if (duration > 1000) {
      console.warn(`[Slow API] ${endpoint}:`, `${duration.toFixed(2)}ms`);
    }

    return result;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Get Core Web Vitals
 * @returns {Promise<Object>} - Web vitals metrics
 */
export async function getCoreWebVitals() {
  if (typeof window === 'undefined') return {};

  const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import(
    'web-vitals'
  );

  const metrics = {};

  getCLS((metric) => {
    metrics.CLS = metric.value;
    reportWebVitals(metric);
  });

  getFID((metric) => {
    metrics.FID = metric.value;
    reportWebVitals(metric);
  });

  getFCP((metric) => {
    metrics.FCP = metric.value;
    reportWebVitals(metric);
  });

  getLCP((metric) => {
    metrics.LCP = metric.value;
    reportWebVitals(metric);
  });

  getTTFB((metric) => {
    metrics.TTFB = metric.value;
    reportWebVitals(metric);
  });

  return metrics;
}

/**
 * Monitor memory usage
 * @returns {Object} - Memory usage info
 */
export function getMemoryUsage() {
  if (typeof window === 'undefined' || !performance.memory) {
    return null;
  }

  const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } =
    performance.memory;

  return {
    used: `${(usedJSHeapSize / 1048576).toFixed(2)} MB`,
    total: `${(totalJSHeapSize / 1048576).toFixed(2)} MB`,
    limit: `${(jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
    percentage: ((usedJSHeapSize / jsHeapSizeLimit) * 100).toFixed(2),
  };
}

/**
 * Check if device is low-end
 * @returns {boolean} - True if low-end device
 */
export function isLowEndDevice() {
  if (typeof navigator === 'undefined') return false;

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 1;

  // Check device memory (if available)
  const memory = navigator.deviceMemory || 4; // Default to 4GB

  // Consider device low-end if <= 2 cores or <= 2GB RAM
  return cores <= 2 || memory <= 2;
}

/**
 * Optimize images based on device
 * @param {string} url - Image URL
 * @returns {string} - Optimized URL
 */
export function getOptimizedImageUrl(url, options = {}) {
  const { width, quality = 85, format = 'webp' } = options;

  // For low-end devices, reduce quality
  const finalQuality = isLowEndDevice() ? Math.min(quality, 70) : quality;

  // Add optimization parameters (example for CDN)
  const params = new URLSearchParams({
    w: width || 800,
    q: finalQuality,
    fm: format,
  });

  return `${url}?${params.toString()}`;
}
