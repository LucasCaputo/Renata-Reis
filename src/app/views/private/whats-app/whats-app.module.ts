import { NgModule } from '@angular/core';

import { WhatsAppRoutingModule } from './whats-app-routing.module';

import { SharedModule } from 'src/app/shared/shared.module';

import { WhatsAppComponent } from './whats-app.component';

@NgModule({
  declarations: [WhatsAppComponent],
  imports: [WhatsAppRoutingModule, SharedModule],
  providers: [],
})
export class WhatsAppModule {}
