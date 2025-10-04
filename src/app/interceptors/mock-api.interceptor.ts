/**
 * Mock API Interceptor for Contact Details CRM
 * 
 * This interceptor simulates a backend API by intercepting HTTP requests 
 * to '/api/*' endpoints and returning mock data from JSON files stored 
 * in the assets folder. This is used for development and testing purposes.
 * 
 * Features:
 * - Intercepts all API calls starting with '/api/'
 * - Loads mock data from JSON files in assets folder
 * - Simulates realistic API latency (150ms delay)
 * - Supports both GET and POST operations
 * - Returns proper HTTP responses with status codes
 * 
 * Mock Data Files:
 * - contactData.json: Contact information (names, emails, addresses)
 * - contactField.json: Form field schema definitions
 * - layouts.json: Page layout configurations
 * - conversations.json: Chat/conversation data
 * - notes.json: Note entries
 * - tasks.json: Task items
 * 
 * @author CRM Development Team
 * @version 1.0
 * @since 2025-10-04
 */

import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contact, PageLayout, FolderDef, Conversation, Note, Task } from '../models';

/**
 * Mock API Interceptor Function
 * 
 * Intercepts HTTP requests and provides mock responses for API endpoints.
 * Only processes requests that start with '/api/', all other requests 
 * are passed through to the next handler.
 * 
 * @param req - The HTTP request being intercepted
 * @param next - The next handler in the interceptor chain
 * @returns Observable<HttpEvent<unknown>> - HTTP response or next handler result
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  // Only intercept API calls, let all other requests pass through
  if (!req.url.startsWith('/api/')) return next(req);

  // Inject HttpClient to load JSON files from assets
  const http = inject(HttpClient);
  
  // Simulated network latency to mimic real API behavior
  const LAG = 150; // milliseconds

  /**
   * GET Request Router
   * Routes different API endpoints to their corresponding JSON files
   */
  if (req.method === 'GET') {
    switch (req.url) {
      // Layout configurations for different page arrangements
      case '/api/layouts':
        return from(http.get<Record<'default' | 'alt' | 'opt3', PageLayout>>('./assets/layouts.json')).pipe(
          map(data => new HttpResponse({ status: 200, body: data })),
          delay(LAG)
        );
      
      // Form field schema and validation rules
      case '/api/schema':
        return from(http.get<{ folders: ReadonlyArray<FolderDef> }>('./assets/contactField.json')).pipe(
          map(data => new HttpResponse({ status: 200, body: data })),
          delay(LAG)
        );
      
      // Contact database records
      case '/api/contacts':
        return from(http.get<Contact[]>('./assets/contactData.json')).pipe(
          map(data => new HttpResponse({ status: 200, body: data })),
          delay(LAG)
        );
      
      // Conversation/chat history
      case '/api/conversations':
        return from(http.get<Conversation[]>('./assets/conversations.json')).pipe(
          map(data => new HttpResponse({ status: 200, body: data })),
          delay(LAG)
        );
      
      // Note entries and documentation
      case '/api/notes':
        return from(http.get<Note[]>('./assets/notes.json')).pipe(
          map(data => new HttpResponse({ status: 200, body: data })),
          delay(LAG)
        );
      
      // Task management items
      case '/api/tasks':
        return from(http.get<Task[]>('./assets/tasks.json')).pipe(
          map(data => new HttpResponse({ status: 200, body: data })),
          delay(LAG)
        );
    }
  }

  /**
   * POST Request Handler
   * Handles creation of new contacts
   * 
   * Note: In a real application, this would save to a database.
   * Here we just return the submitted contact with a 201 Created status.
   */
  if (req.method === 'POST' && req.url === '/api/contacts') {
    // Extract the new contact data from request body
    const newContact = req.body as Contact;
    
    // Return success response with the created contact
    return of(new HttpResponse({ status: 201, body: newContact })).pipe(
      delay(LAG)
    );
  }

  /**
   * Fallback for unmatched routes
   * Returns 404 Not Found for any API endpoints not handled above
   */
  return of(
    new HttpResponse({ status: 404, body: { error: 'API endpoint not found' } })
  ).pipe(delay(LAG));
};
