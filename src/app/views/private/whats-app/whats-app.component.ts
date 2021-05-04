import { Component, OnInit } from '@angular/core';
import { WhatsAppService } from './whats-app.service';

@Component({
  selector: 'app-whats-app',
  templateUrl: './whats-app.component.html',
  styleUrls: ['./whats-app.component.scss'],
})
export class WhatsAppComponent implements OnInit {
  qrCode = '';
  loading = true;

  constructor(private whatsAppService: WhatsAppService) {}

  ngOnInit(): void {
    this.whatsAppService.getWhatsAppSession().subscribe(
      (result) => {
        console.log(result);

        this.whatsAppService.getWhatsAppQRcode().subscribe(
          (result) => {
            console.log(result);
            this.qrCode = result.qrcode;
            this.loading = false;
          },
          (error) => {
            console.log(error);
            this.loading = false;
          }
        );
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
  }
}
