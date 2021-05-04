import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class WhatsAppService {
  user = this.authService.getUser();
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  public getWhatsAppSession(): Observable<any> {
    return this.httpClient.get<any>(
      'https://whatsapp2.contrateumdev.com.br/start?sessionName=' +
        this.user!.login.slice(0, 4)
    );
  }

  public getWhatsAppQRcode(): Observable<any> {
    return this.httpClient.get<any>(
      'https://whatsapp2.contrateumdev.com.br/qrcode?sessionName=' +
        this.user!.login.slice(0, 4)
    );
  }

  public postWhatsAppMessage(data: any): Observable<any> {
    return this.httpClient.post<any>(
      'https://whatsapp2.contrateumdev.com.br/sendText',
      data
    );
  }
}
