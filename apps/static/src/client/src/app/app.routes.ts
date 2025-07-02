import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: '', loadComponent: () => import('./content/list').then(m => m.List)},
];
