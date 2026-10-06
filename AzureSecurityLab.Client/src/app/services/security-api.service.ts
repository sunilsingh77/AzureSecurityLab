import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface SecurityProfile {
  message: string;

  user?: string;

  objectId?: string;

  tenantId?: string;

  scopes?: string;

  roles?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class SecurityApiService {
  private readonly baseUrl = `${environment.api.baseUrl}/security`;

  private readonly http = inject(HttpClient);

  getProfile(): Observable<SecurityProfile> {
    return this.http.get<SecurityProfile>(`${this.baseUrl}/profile`);
  }

  getAdmin(): Observable<SecurityProfile> {
    return this.http.get<SecurityProfile>(`${this.baseUrl}/admin`);
  }
}
