
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

@Injectable({
  providedIn: 'root'
})
export class SqlTestService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.api.baseUrl}/security/sql-test`;

  getRecords(): Observable<SqlTestResponse> {
    
    const test = this.http.get<SqlTestResponse>(this.apiUrl);
   console.log(JSON.stringify(test));
   alert(JSON.stringify(test));
    return test;
  }
}
