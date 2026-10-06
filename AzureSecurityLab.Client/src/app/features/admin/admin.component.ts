import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface AdminResponse {
  message: string;
  isAuthenticated: boolean;
  user: string;
  isAdmin: boolean;
  roleClaimType: string;
  allClaims: {
    type: string;
    value: string;
  }[];
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html'
})
export class AdminComponent {

  loading = false;
  errorMessage = '';
  adminResponse: AdminResponse | null = null;
  private readonly http = inject(HttpClient);

  callAdminApi(): void {

    this.loading = true;
    this.errorMessage = '';
    this.adminResponse = null;

    this.http
      .get<AdminResponse>(
        `${environment.api.baseUrl}/security/admin`
      )
      .subscribe({

        next: (response) => {

          console.log('Admin API response:', response);

          this.adminResponse = response;
          this.loading = false;
        },

        error: (error) => {

          console.error('Admin API error:', error);

          this.errorMessage =
            error?.error?.message ||
            `API call failed: ${error.status} ${error.statusText}`;

          this.loading = false;
        },

        complete: () => {

          console.log('Admin API request completed.');

        }

      });
  }
}