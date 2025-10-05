import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BehaviorSubject, combineLatest, map } from 'rxjs';

import { LayoutService } from './services/layout.service';
import { ActivitiesService } from './services/activities.service';
import { ContactDetailsComponent } from './components/ui/contact-details/contact-details.component';
import { ConversationsComponent } from './components/ui/conversations/conversations.component';
import { NotesComponent } from './components/ui/notes/notes.component';
import { TasksComponent } from './components/ui/tasks/tasks.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, FormsModule,
    ContactDetailsComponent, ConversationsComponent, NotesComponent, TasksComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  /**
   * Current active layout key
   * Controls which layout preset is currently displayed
   * Synchronized with the reactive stream for consistent state
   */
  activeKey: string = 'default';

  /**
   * Reactive version of activeKey for RxJS stream coordination
   * BehaviorSubject ensures immediate emission of current value to new subscribers
   * This enables reactive layout switching without manual template updates
   */
  private activeKey$ = new BehaviorSubject<string>(this.activeKey);

  /**
   * Available Layout Keys
   * Dynamically extracted from the layout service response
   * This automatically adapts when new layouts are added to the JSON file
   */
  layoutKeys$ = this.layoutSvc.getAll().pipe(
    map(layouts => Object.keys(layouts))
  );

  /**
   * Dynamic Layout Stream
   * Combines layout configurations with the active key selection
   * Automatically updates when either layouts or active key changes
   * Returns the currently selected PageLayout configuration
   */
  layout$ = combineLatest([
    this.layoutSvc.getAll(), // Record<string, PageLayout>
    this.activeKey$,
  ]).pipe(map(([all, key]) => all[key]));

  conversations$ = this.activities.conversations$;
  notes$ = this.activities.notes$;
  tasks$ = this.activities.tasks$;

  constructor(
    private layoutSvc: LayoutService,
    private activities: ActivitiesService
  ) {}

  /**
   * Layout Change Handler
   * 
   * Updates both the template-bound property and the reactive stream
   * when the user switches between layout presets.
   * 
   * This dual update ensures:
   * - Immediate template synchronization
   * - Reactive stream propagation to all subscribers
   * 
   * @param next - The new layout key to activate (any valid layout key)
   */
  onKeyChange(next: string) {
    this.activeKey = next; // keep template in sync
    this.activeKey$.next(next); // drive the reactive stream
  }

  /**
   * Get Display Name for Layout Key
   * 
   * Converts layout keys to user-friendly display names.
   * Provides a centralized way to format layout names for the UI.
   * 
   * @param key - The layout key (e.g., 'default', 'alt', 'opt3')
   * @returns string - Formatted display name
   */
  getLayoutDisplayName(key: string): string {
    const displayNames: Record<string, string> = {
      'default': 'Default',
      'folderUpdate': 'Folder Switch',
      'columnSwitch': 'Column Switch',
      'columnSwitch2': 'Column Switch 2',
      'opt5': 'Option 5',
    };
    
    // Return custom name if defined, otherwise capitalize the key
    return displayNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }
}
