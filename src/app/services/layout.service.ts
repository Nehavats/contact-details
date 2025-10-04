/**
 * Layout Service - Dynamic Page Layout Management
 * 
 * Manages the dynamic layout system that allows users to rearrange
 * UI sections (contact details, conversations, notes, tasks) into
 * different column configurations. Provides caching for optimal performance.
 * 
 * Key Features:
 * - Multiple layout presets (default, alt, opt3)
 * - Intelligent caching with shareReplay
 * - Reactive data streams for real-time layout updates
 * - Flexible 3-column layout system
 * 
 * Layout System:
 * - Three columns: left, middle, right
 * - Four sections: contactDetails, conversations, notes, tasks
 * - Configurable section placement in any column
 * - Preset layouts for common arrangements
 * 
 * Caching Strategy:
 * - Uses shareReplay to cache API response
 * - Prevents multiple API calls for same data
 * - Maintains cache even when no active subscribers
 * 
 * @author CRM Development Team
 * @version 1.0
 * @since 2025-10-04
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PageLayout } from '../models';
import { map, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  
  /**
   * Cached Layout Configurations
   * 
   * Fetches and caches all available layout configurations from the API.
   * Uses shareReplay to:
   * - Cache the HTTP response to prevent repeated API calls
   * - Share the same data stream across multiple subscribers
   * - Maintain cache even when subscriber count drops to zero
   * 
   * Buffer Size: 1 (keeps only the latest emission)
   * Ref Count: false (maintains cache regardless of subscribers)
   */
  private cache$ = this.http
    .get<Record<string, PageLayout>>('/api/layouts')
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

  /**
   * Constructor - Inject HTTP client for API communication
   * 
   * @param http - Angular HTTP client for layout configuration retrieval
   */
  constructor(private http: HttpClient) {}

  /**
   * Get All Layout Configurations
   * 
   * Returns all available layout presets as a Record object.
   * Useful for components that need to switch between layouts
   * or display layout options to users.
   * 
   * @returns Observable<Record<string, PageLayout>> - All layout configurations
   */
  getAll() {
    return this.cache$;
  }

  /**
   * Get Specific Layout Configuration
   * 
   * Returns a single layout configuration by key.
   * Extracts the requested layout from the cached data stream.
   * 
   * @param key - Layout identifier (any valid layout key)
   * @returns Observable<PageLayout> - Specific layout configuration
   */
  get(key: string) {
    return this.cache$.pipe(map((d) => d[key]));
  }
}
