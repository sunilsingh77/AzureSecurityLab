
import { Component, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { environment } from '../../environments/environment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-downstream-test',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './downstream-test.component.html',
  styleUrl: './downstream-test.component.scss'
})
export class DownstreamTestComponent {
  private readonly http = inject(HttpClient);

  readonly endpoint =
    `${environment.api.baseUrl}/security/downstream/test`;

  isLoading = false;
  statusCode: number | null = null;
  responseBody = '';
  errorMessage = '';
  lastTestedAt: Date | null = null;

  testConnection(): void {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.statusCode = null;
    this.responseBody = '';
    this.errorMessage = '';

    this.http.get<unknown>(this.endpoint).pipe(
      finalize(() => {
        this.isLoading = false;
        this.lastTestedAt = new Date();
      })
    ).subscribe({
      next: (response) => {
        this.statusCode = 200;
        this.responseBody = this.formatResponse(response);
      },
      error: (error: HttpErrorResponse) => {
        this.statusCode = error.status || null;

        const details = error.error;

        this.responseBody = details
          ? this.formatResponse(details)
          : error.message;

        this.errorMessage = this.getErrorMessage(error);
      }
    });
  }

  private formatResponse(value: unknown): string {
    if (typeof value === 'string') {
      try {
        return JSON.stringify(JSON.parse(value), null, 2);
      } catch {
        return value;
      }
    }

    return JSON.stringify(value, null, 2) ?? String(value);
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'The API could not be reached. Check connectivity, HTTPS, and browser console errors.';
    }

    if (error.status === 401) {
      return 'Authentication failed. Sign in again and verify that the request includes an access token for AzureSecurityLab.Api.';
    }

    if (error.status === 403) {
      return 'Access was forbidden. Check the required application role and authorization policy.';
    }

    if (error.status === 502) {
      return 'The caller API could not complete the downstream request. Inspect the Azure App Service logs for the underlying exception.';
    }

    if (error.status >= 500) {
      return 'The server encountered an error. Inspect the caller and downstream API logs.';
    }

    return `The request failed with HTTP ${error.status}.`;
  }
}
