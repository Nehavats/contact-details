/**
 * Contacts Service - Contact Management and State Management
 * 
 * Manages contact data throughout the application using reactive patterns.
 * Provides CRUD operations for contacts and maintains application state
 * using BehaviorSubject for real-time updates across components.
 * 
 * Key Features:
 * - Reactive state management with BehaviorSubject
 * - Automatic initialization on service creation
 * - Optimistic UI updates for adding contacts
 * - HTTP-based persistence through API layer
 * - Observable streams for component subscriptions
 * 
 * State Management Pattern:
 * - Uses BehaviorSubject to emit current state immediately to new subscribers
 * - Maintains local state cache for immediate UI updates
 * - Synchronizes with backend through HTTP calls
 * 
 * @author CRM Development Team
 * @version 1.0
 * @since 2025-10-04
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Contact } from '../models';

@Injectable({ providedIn: 'root' })
export class ContactsService {
  
  /**
   * Internal state management for contacts list
   * BehaviorSubject ensures immediate emission of current state
   * Null initial value indicates loading state
   */
  private readonly state$ = new BehaviorSubject<Contact[] | null>(null);

  /**
   * Constructor - Automatically initialize contact data
   * 
   * @param http - Angular HTTP client for API communication
   */
  constructor(private http: HttpClient) {
    this.init(); // Load contacts immediately when service is created
  }

  /**
   * Initialize contacts data from API
   * 
   * Private method that loads initial contact data from the backend.
   * Uses firstValueFrom to convert Observable to Promise for async/await pattern.
   * Updates the internal state once data is loaded.
   * 
   * Error Handling: Errors will be thrown to the caller for appropriate handling
   */
  private async init() {
    const res = await firstValueFrom(this.http.get<Contact[]>('/api/contacts'));
    this.state$.next(res);
  }

  /**
   * Public Observable for Component Subscriptions
   * 
   * Exposes the contacts state as an Observable for components to subscribe to.
   * Components will receive immediate updates when contacts are added/modified.
   * 
   * @returns Observable<Contact[] | null> - Stream of contact arrays or null during loading
   */
  contacts$ = this.state$.asObservable();

  /**
   * Add New Contact
   * 
   * Creates a new contact via API and updates local state optimistically.
   * Provides immediate UI feedback while ensuring backend persistence.
   * 
   * Process:
   * 1. Send POST request to API
   * 2. Receive created contact with any server-generated fields
   * 3. Update local state with new contact
   * 4. Emit updated state to all subscribers
   * 
   * @param contact - The contact data to create
   * @throws Error if API call fails
   */
  async add(contact: Contact) {
    // Create contact via API (may return additional server-generated fields)
    const created = await firstValueFrom(this.http.post<Contact>('/api/contacts', contact));
    
    // Update local state with new contact
    const curr = this.state$.value ?? [];
    this.state$.next([...curr, created]);
  }
}
