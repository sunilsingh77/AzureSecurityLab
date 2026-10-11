
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface StorageUploadResponse {
  message: string;
  blobName: string;
  originalFileName: string;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.api.baseUrl}/storage`;

  upload(file: File): Observable<StorageUploadResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<StorageUploadResponse>(
      `${this.apiUrl}/upload`,
      formData
    );
  }

  download(blobName: string): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/download/${encodeURIComponent(blobName)}`,
      { responseType: 'blob' }
    );
  }
}
