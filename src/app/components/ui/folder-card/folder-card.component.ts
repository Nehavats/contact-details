/**
 * Folder Card Component - Collapsible Form Section Container
 * 
 * A reusable UI component that renders a collapsible section (folder) containing
 * related form fields. Provides field filtering, expansion/collapse functionality,
 * and organized display of contact information in logical groups.
 * 
 * Key Features:
 * - Collapsible/expandable sections for organized data display
 * - Field filtering based on search criteria
 * - Dynamic field rendering using FieldRowComponent
 * - Folder-based organization (Contact Info, Additional Info, etc.)
 * - Icon support for visual identification
 * - Responsive design with proper accessibility
 * 
 * Component Hierarchy:
 * FolderCardComponent
 * └── FieldRowComponent (for each field in folder)
 *     └── Dynamic field UI based on field type
 * 
 * Input Properties:
 * - folder: Schema definition with fields and metadata
 * - data: Contact data object for field values
 * - filter: Search term for field filtering
 * - defaultOpen: Initial expansion state
 * 
 * Data Flow:
 * 1. Receives folder definition and contact data
 * 2. Filters fields based on search criteria
 * 3. Renders matching fields using FieldRowComponent
 * 4. Handles expand/collapse state management
 * 
 * @author CRM Development Team
 * @version 1.0
 * @since 2025-10-04
 */

import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderDef, FieldDef, Contact } from 'src/app/models';
import { FieldRowComponent } from '../field-row/field-row.component';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'ui-folder-card',
  standalone: true,
  imports: [CommonModule, FieldRowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './folder-card.component.html',
  styleUrls: ['./folder-card.component.scss'],
})
export class FolderCardComponent implements OnChanges {
  
  @Input() folder!: FolderDef;
  @Input() data!: Record<string, any>;
  @Input() filter = '';
  @Input() defaultOpen = false;
  contacts$ = this.contactsSvc.contacts$;
  current: Contact | null = null;
  idx = 0;
  total = 0;
  open = this.defaultOpen;
  isAdding = false;
  newContactData: Record<string, any> = {};
  constructor(private contactsSvc: ContactsService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['defaultOpen']) {
      this.open = this.defaultOpen;
    }
  }

  toggleOpen(event: Event) {
    // Only toggle if we're not in adding mode
    if (!this.isAdding) {
      this.open = !this.open;
    }
  }

  filteredFields(): ReadonlyArray<FieldDef> {
    const f = this.filter.trim().toLowerCase();
    if (!f) return this.folder?.fields ?? [];
    return (this.folder?.fields ?? []).filter(
      (fl) =>
        fl.label.toLowerCase().includes(f) ||
        fl.key.toLowerCase().includes(f)
    );
  }

  add(event?: Event) {
    if (event) {
      event.stopPropagation(); // Prevent the header click from firing
    }
    this.isAdding = true;
    this.open = true; // Ensure folder is expanded when adding
    
    // Initialize empty contact data for new contact
    this.newContactData = {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      businessName: '',
      streetAddress: '',
      city: '',
      country: '',
      owner: '',
      followers: [],
      tags: [],
    };
  }

  save() {
    if (this.isAdding) {
      // Add the new contact to the service
      this.contactsSvc.add(this.newContactData as Contact);
      
      // Reset add mode
      this.isAdding = false;
      this.newContactData = {};
      
      // Move to the newly created contact
      setTimeout(() => {
        this.idx = this.total - 1;
        this.syncCurrent();
      });
    }
  }

  cancel() {
    this.isAdding = false;
    this.newContactData = {};
  }

  onFieldValueChange(fieldKey: string, newValue: any) {
    if (this.isAdding) {
      // Update the new contact data when adding
      this.newContactData[fieldKey] = newValue;
    } else {
      // Update the existing contact data when editing
      if (this.data) {
        this.data[fieldKey] = newValue;
      }
    }
  }

  syncCurrent() {
    const list = (this.contactsSvc as any).state$.value as Contact[] | null;
    const arr = list ?? [];
    this.current = arr[this.idx] ?? null;
  }

  trackField(i: number, f: FieldDef) {
    return f.key;
  }
}
