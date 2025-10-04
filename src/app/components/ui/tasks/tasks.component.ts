import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'tasks-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent {
  @Input() items: Array<{ text: string; due: string; done: boolean }> = [];

  track(i: number, v: any) {
    return i;
  }

  toggleTask(task: { text: string; due: string; done: boolean }) {
    task.done = !task.done;
  }
}
