import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'clientes', loadChildren: () => import('./views/customer/customer.module').then(m => m.CustomerModule) },
  { path: 'agenda', loadChildren: () => import('./views/schedule/schedule.module').then(m => m.ScheduleModule) },
  {
    path: '',
    redirectTo: '/agenda',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
