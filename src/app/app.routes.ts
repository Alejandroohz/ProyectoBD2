import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdministradorComponent } from './pages/administrador/administrador.component';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
     
      {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
        {
          path: '',
          redirectTo: 'administrador',
          pathMatch: 'full'
        },
        {
          path: 'administrador',
          component: AdministradorComponent
          
        },
      ]
      }
    


];
