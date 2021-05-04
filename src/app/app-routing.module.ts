import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateRoutesGuard } from './shared/guards/private-routes/private-routes.guard';
import { PublicRoutesGuard } from './shared/guards/public-routes/public-routes.guard';
import { Erro404Component } from './shared/pages/erro404/erro404.component';
import { PrivateComponent } from './views/private/private.component';
import { PublicComponent } from './views/public/public.component';

const routes: Routes = [
  {
    path: '',
    component: PrivateComponent,
    canActivate: [PrivateRoutesGuard],
    children: [
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
      },
      {
        path: 'clientes',
        loadChildren: () =>
          import('./views/private/customer/customer.module').then(
            (m) => m.CustomerModule
          ),
      },
      {
        path: 'agenda',
        loadChildren: () =>
          import('./views/private/schedule/schedule.module').then(
            (m) => m.ScheduleModule
          ),
      },
      {
        path: 'whatsapp',
        loadChildren: () =>
          import('./views/private/whats-app/whats-app.module').then(
            (m) => m.WhatsAppModule
          ),
      },
    ],
  },
  {
    path: '',
    component: PublicComponent,
    canActivate: [PublicRoutesGuard],
    children: [
      {
        path: 'cadastro',
        loadChildren: () =>
          import('./views/public/new-user/new-user.module').then(
            (m) => m.NewUserModule
          ),
      },
      {
        path: 'login',
        loadChildren: () =>
          import('./views/public/login/login.module').then(
            (m) => m.LoginModule
          ),
      },
    ],
  },
  {
    path: '**',
    component: Erro404Component,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
