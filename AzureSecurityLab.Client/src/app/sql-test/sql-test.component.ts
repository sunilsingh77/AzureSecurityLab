
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import {
  SqlTestService,
  SqlTestResponse
} from '../services/sql-test.service';

@Component({
  selector: 'app-sql-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sql-test.component.html',
  styleUrl: './sql-test.component.scss'
})
export class SqlTestComponent {
  private readonly sqlTestService = inject(SqlTestService);

  loading = false;
  errorMessage = '';
  result: SqlTestResponse | null = null;

  testConnection(): void {
    if (this.loading) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.result = null;

    this.sqlTestService
      .getRecords()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (response: SqlTestResponse) => {
          this.result = response;
        },
        error: (error) => {
          console.error('Azure SQL test failed:', error);

          switch (error.status) {
            case 0:
              this.errorMessage =
                'Unable to reach the API. Check the API URL, CORS configuration, and network connectivity.';
              break;

            case 401:
              this.errorMessage =
                '401 Unauthorized. Please sign in and verify that the API access token is being sent.';
              break;

            case 403:
              this.errorMessage =
                '403 Forbidden. Check the API authorization policy and required roles or scopes.';
              break;

            case 500:
              this.errorMessage =
                '500 Internal Server Error. Check the API logs for SQL connectivity, token acquisition, and database permission errors.';
              break;

            default:
              this.errorMessage =
                `Request failed with HTTP ${error.status || 'unknown'}. Check the browser console and API logs.`;
          }
        }
      });
  }
}
