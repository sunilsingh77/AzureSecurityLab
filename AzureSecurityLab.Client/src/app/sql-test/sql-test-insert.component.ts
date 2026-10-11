import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SqlTestService, SqlInsertResponse } from '../services/sql-test.service';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sql-test-insert.component.html'
})
export class SqlTestInsertComponent {
  private readonly securityService = inject(SqlTestService);

  inserting = false;
  insertResult?: SqlInsertResponse;
  insertError = '';

  insertSqlRecord(): void {
    this.inserting = true;
    this.insertResult = undefined;
    this.insertError = '';

    this.securityService.insertSqlTestRecord().subscribe({
      next: (response) => {
        this.insertResult = response;
        this.inserting = false;
      },
      error: (error) => {
        console.error('SQL insert failed:', error);

        this.insertError =
          error?.error?.detail ??
          error?.error?.message ??
          `Request failed (${error.status || 'network error'}). Check the API console and browser Network tab.`;

        this.inserting = false;
      }
    });
  }
}