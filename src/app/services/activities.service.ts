import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Conversation, Note, Task } from '../models';
import { shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ActivitiesService {
  conversations$ = this.http
    .get<Conversation[]>('/api/conversations')
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

  notes$ = this.http
    .get<Note[]>('/api/notes')
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

  tasks$ = this.http
    .get<Task[]>('/api/tasks')
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

  constructor(private http: HttpClient) {}
}
