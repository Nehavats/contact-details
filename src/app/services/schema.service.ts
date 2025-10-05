/**
 * Schema Service - Form Field Definition Management
 * 
 * Manages the dynamic form schema that defines how contact forms are
 * structured and rendered. Provides field definitions, validation rules,
 * and form organization through folder-based grouping.
 * 
 * Key Features:
 * - Dynamic form field definitions
 * - Folder-based field organization
 * - Type-safe field configurations
 * - Caching for optimal performance
 * - Support for various field types (text, email, phone, radio, multi-select)
 * 
 * Form Schema Structure:
 * - Folders: Logical groupings of related fields (e.g., "Contact", "Additional Info")
 * - Fields: Individual form elements with type, label, and validation rules
 * - Options: Available choices for radio and multi-select fields
 * 
 * Field Types Supported:
 * - string: Single-line text input
 * - string-multiline: Multi-line textarea
 * - phone: Phone number with formatting
 * - email: Email with validation
 * - radio: Single selection from options
 * - multi-select: Multiple selection from options
 * 
 * @author CRM Development Team
 * @version 1.0
 * @since 2025-10-04
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FolderDef, PageLayout } from '../models';
import { map, shareReplay, combineLatest } from 'rxjs';
import { LayoutService } from './layout.service';

@Injectable({ providedIn: 'root' })
export class SchemaService {
  
  /**
   * Cached Schema Configuration
   * 
   * Fetches and caches the complete form schema from the API.
   * The schema defines the structure of contact forms including
   * field definitions, types, labels, and organization.
   * 
   * Caching Strategy:
   * - shareReplay prevents multiple API calls for the same schema
   * - bufferSize: 1 keeps only the latest schema version
   * - refCount: false maintains cache even without active subscribers
   * 
   * Schema Format:
   * {
   *   folders: [
   *     {
   *       name: "Contact",
   *       icon: "user",
   *       fields: [{ key: "firstName", label: "First Name", type: "string" }]
   *     }
   *   ]
   * }
   */
  private cache$ = this.http
    .get<{ folders: ReadonlyArray<FolderDef> }>('/api/schema')
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

  constructor(
    private http: HttpClient,
    private layoutService: LayoutService
  ) {}

  /**
   * Get Form Folder Definitions
   * 
   * Returns the array of folder definitions that organize form fields
   * into logical groups. Each folder contains related fields and
   * provides visual organization in the UI.
   * 
   * Usage:
   * - Dynamic form generation
   * - Field validation setup
   * - UI organization and grouping
   * - Form section rendering
   * 
   * @returns Observable<ReadonlyArray<FolderDef>> - Array of folder definitions
   */
  getFolders() {
    return this.cache$.pipe(map((r) => r.folders));
  }

  /**
   * Get Form Folder Definitions with Custom Ordering
   * 
   * Returns folders ordered according to the specified layout configuration.
   * If the layout has a folderOrder property, folders will be reordered accordingly.
   * Otherwise, returns folders in their default order.
   * 
   * @param layoutKey - The layout key to get folder ordering from
   * @returns Observable<ReadonlyArray<FolderDef>> - Array of folder definitions in custom order
   */
  getFoldersWithOrder(layoutKey: string) {
    return combineLatest([
      this.cache$,
      this.layoutService.get(layoutKey)
    ]).pipe(
      map(([schema, layout]) => {
        const folders = schema.folders;
        
        // If layout has custom folder order, apply it
        if (layout?.folderOrder && layout.folderOrder.length > 0) {
          const orderedFolders: FolderDef[] = [];
          
          // Add folders in the specified order
          layout.folderOrder.forEach(folderName => {
            const folder = folders.find(f => f.name === folderName);
            if (folder) {
              orderedFolders.push(folder);
            }
          });
          
          // Add any remaining folders not in the custom order
          folders.forEach(folder => {
            if (!layout.folderOrder!.includes(folder.name)) {
              orderedFolders.push(folder);
            }
          });
          
          return orderedFolders;
        }
        
        // Return default order if no custom ordering specified
        return folders;
      })
    );
  }
}
