
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SecurityLabRecord {
  id: number;
  recordName: string;
  createdAtUtc: string;
}

export interface SqlTestResponse {
  database: string;
  count: number;
  records: SecurityLabRecord[];
}

export interface SqlInsertResponse {
  message: string;
  id: number;
  recordName: string;
  createdAtUtc: string;
}

@Injectable({
  providedIn: 'root'
})
export class SqlTestService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =environment.api.baseUrl;
  getRecords(): Observable<SqlTestResponse> {    
    return this.http.get<SqlTestResponse>(`${this.apiUrl}/security/sql-test`);
  }
  
  insertSqlTestRecord(): Observable<SqlInsertResponse> {
      return this.http.post<SqlInsertResponse>(`${this.apiUrl}/security/sql-test/insert`,
        {
          "message": "Record inserted successfully.",
          "id": 2,
          "recordName": "Managed Identity Insert Test",
          "createdAtUtc": "2026-10-11T..."
        }
      );
    }

}
