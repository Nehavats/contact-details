import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { cacheInterceptor } from './app/interceptors/cache.interceptor';
import { mockApiInterceptor } from './app/interceptors/mock-api.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([cacheInterceptor, mockApiInterceptor])
    ),
  ],
}).catch((err) => console.error(err));
