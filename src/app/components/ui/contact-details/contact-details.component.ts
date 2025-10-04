/**
 * Contact Details Component - Dynamic Contact Form and Navigation
 * 
 * The main contact management interface that provides dynamic form generation,
 * contact navigation, and data entry capabilities. This component serves as
 * the primary interface for viewing and editing contact information.
 * 
 * Key Features:
 * - Dynamic form generation based on schema configuration
 * - Contact navigation (previous/next) with circular browsing
 * - Real-time contact filtering and search
 * - Folder-based field organization
 * - Reactive data binding with automatic updates
 * - OnPush change detection for optimal performance
 * 
 * Component Architecture:
 * - Standalone component with direct imports
 * - Reactive programming with RxJS streams
 * - Schema-driven form generation
 * - Separation of concerns with dedicated services
 * 
 * Data Flow:
 * 1. Fetches contacts list from ContactsService
 * 2. Loads form schema from SchemaService
 * 3. Renders dynamic form using FolderCardComponent
 * 4. Handles navigation and filtering locally
 * 5. Updates display reactively when data changes
 * 
 * Navigation Behavior:
 * - Maintains current contact index
 * - Supports previous/next navigation
 * - Handles edge cases (first/last contact)
 * - Syncs with contact list changes
 * 
 * @author CRM Development Team
 * @version 1.0
 * @since 2025-10-04
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { map } from 'rxjs';
import { Contact, FolderDef } from 'src/app/models';
import { ContactsService } from 'src/app/services/contacts.service';
import { SchemaService } from 'src/app/services/schema.service';
import { FolderCardComponent } from '../folder-card/folder-card.component';

@Component({
  selector: 'contact-details',
  standalone: true,
  imports: [CommonModule, FormsModule, FolderCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss']
})
export class ContactDetailsComponent {
  
  filter = '';
  idx = 0;
  total = 0;
  contacts$ = this.contactsSvc.contacts$;
  current: Contact | null = null;
  folders$ = this.schemaSvc.getFolders();

  constructor(
    private contactsSvc: ContactsService,
    private schemaSvc: SchemaService
  ) {
    this.contacts$.pipe(map((list) => list ?? [])).subscribe((list) => {
      this.total = list.length;
      this.idx = Math.min(this.idx, Math.max(0, this.total - 1));
      this.current = list[this.idx] ?? null;
    });
  }

  prev() {
    if (this.idx > 0) {
      this.idx--;
      this.syncCurrent();
    }
  }

  next() {
    if (this.idx < this.total - 1) {
      this.idx++;
      this.syncCurrent();
    }
  }

  syncCurrent() {
    const list = (this.contactsSvc as any).state$.value as Contact[] | null;
    const arr = list ?? [];
    this.current = arr[this.idx] ?? null;
  }

  fullName(c: Contact) {
    const f = c.firstName || '';
    const l = c.lastName || '';
    const n = (f + ' ' + l).trim();
    return n || '—';
  }

  initials(name: string) {
    return (name || '')
      .split(/\s+/)
      .map((s) => s[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  track(i: number, v: string) {
    return v;
  }

  trackFolder(i: number, folder: FolderDef) {
    return folder.name;
  }
}
