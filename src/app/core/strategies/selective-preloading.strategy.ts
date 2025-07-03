import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  private preloadedModules: string[] = [];

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Only preload routes that have a preload flag or are high priority
    if (route.data?.['preload'] || this.shouldPreload(route.path)) {
      console.log('Preloading:', route.path);
      this.preloadedModules.push(route.path || '');
      
      // Delay preloading by 2 seconds to not interfere with initial load
      return timer(2000).pipe(
        switchMap(() => load())
      );
    }
    
    return of(null);
  }

  private shouldPreload(path: string | undefined): boolean {
    // Preload commonly accessed routes
    const highPriorityRoutes = ['cart', 'products', 'wishlist'];
    return highPriorityRoutes.includes(path || '');
  }

  getPreloadedModules(): string[] {
    return this.preloadedModules;
  }
}