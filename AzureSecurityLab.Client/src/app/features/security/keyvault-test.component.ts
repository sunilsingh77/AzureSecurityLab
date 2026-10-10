
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-keyvault-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './keyvault-test.component.html',
  styleUrl: './keyvault-test.component.scss'
})
export class KeyvaultTestComponent {

  private readonly http = inject(HttpClient);

  loading = false;
  response: unknown = null;
  errorMessage = '';

  testKeyVault(): void {
    this.loading = true;
    this.response = null;
    this.errorMessage = '';

    this.http.get(
      `${environment.api.baseUrl}/security/keyvault-test`
    ).subscribe({
      next: response => {
        console.log('Key Vault API response:', response);
        this.response = response;
        this.loading = false;
      },
      error: error => {
        console.error('Key Vault API error:', error);
        this.errorMessage =
          `HTTP ${error.status}: ${
            error.message || error.statusText
          }`;
        this.loading = false;
      }
    });
  }
}
