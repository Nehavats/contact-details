/**
 * HTTP Cache Interceptor - Performance Optimization
 * 
 * Provides intelligent HTTP response caching to improve application performance
 * by preventing redundant API calls for the same data. Implements a simple
 * in-memory cache that persists for the duration of the user session.
 * 
 * Key Features:
 * - Automatic caching of all GET requests
 * - In-memory storage for fast retrieval
 * - URL-based cache keys including query parameters
 * - Response cloning for data integrity
 * - Session-based cache lifecycle
 * 
 * Caching Strategy:
 * - Only caches GET requests (safe, idempotent operations)
 * - Uses complete URL with parameters as cache key
 * - Stores HttpResponse objects including headers and status
 * - Clones responses to prevent accidental mutations
 * 
 * Performance Benefits:
 * - Reduces server load by eliminating duplicate requests
 * - Improves user experience with faster data retrieval
 * - Decreases network bandwidth usage
 * - Provides instant response for cached data
 * 
 * Cache Lifecycle:
 * - Cache is created when application starts
 * - Data persists throughout user session
 * - Cache is cleared when page is refreshed or application reloads
 * - No automatic expiration (suitable for relatively static data)
 * 
 * @author CRM Development Team
 * @version 1.0
 * @since 2025-10-04
 */

import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

/**
 * In-Memory Cache Storage
 * 
 * Simple Map-based cache that stores HTTP responses by URL.
 * Key: Complete URL with query parameters (req.urlWithParams)
 * Value: Cloned HttpResponse to prevent mutations
 * 
 * Cache Characteristics:
 * - Session-scoped (cleared on page refresh)
 * - Memory-efficient for typical CRM data volumes
 * - Fast O(1) lookup performance
 * - Automatic garbage collection when session ends
 */
const CACHE = new Map<string, HttpResponse<unknown>>();

/**
 * HTTP Cache Interceptor Function
 * 
 * Intercepts HTTP requests and implements caching logic for GET requests.
 * Non-GET requests bypass caching since they may have side effects.
 * 
 * Request Flow:
 * 1. Check if request is a GET (cacheable)
 * 2. Generate cache key from URL with parameters
 * 3. Check if response exists in cache
 * 4. Return cached response if available
 * 5. Forward request to server if not cached
 * 6. Cache successful responses for future use
 * 
 * @param req - The HTTP request being intercepted
 * @param next - The next handler in the interceptor chain
 * @returns Observable<HttpEvent<unknown>> - Cached or fresh HTTP response
 */
export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Only cache GET requests - other methods may have side effects
  if (req.method !== 'GET') return next(req);

  // Generate cache key from complete URL including query parameters
  const key = req.urlWithParams;
  
  // Check if we have a cached response for this URL
  const cached = CACHE.get(key);
  if (cached) {
    // Return cloned cached response to prevent mutations
    return of(cached.clone());
  }

  // No cached response - forward to server and cache the result
  return next(req).pipe(
    tap((event) => {
      // Only cache successful HTTP responses
      if (event instanceof HttpResponse) {
        // Store cloned response to prevent future mutations
        CACHE.set(key, event.clone());
      }
    })
  );
};
