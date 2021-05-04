import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WhatsAppComponent } from './whats-app.component';

const routes: Routes = [{ path: '', component: WhatsAppComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WhatsAppRoutingModule {
  constructor() {}
}
