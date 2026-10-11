
import { CommonModule } from '@angular/common';
//import { ChangeDetectorRef,Component, inject } from '@angular/core';
import { Component, inject } from '@angular/core';
import { StorageService, StorageUploadResponse } from '../services/storage.service';

@Component({
  selector: 'app-storage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss']
})
export class StorageComponent {
  private readonly storageService = inject(StorageService);
  //private readonly cdr = inject(ChangeDetectorRef);

  selectedFile?: File;
  uploadResult?: StorageUploadResponse;
  errorMessage = '';
  uploading = false;
  downloading = false;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0];
    this.uploadResult = undefined;
    this.errorMessage = '';
  }

  upload(): void {
    if (!this.selectedFile || this.uploading) {
      return;
    }

    this.uploading = true;
    this.errorMessage = '';
    this.uploadResult = undefined;

    this.storageService.upload(this.selectedFile).subscribe({
      next: result => {
        console.log('UPLOAD NEXT CALLBACK:', result);
        this.uploadResult = result;
        this.uploading = false;

        //this.cdr.detectChanges();

        console.log('Upload result assigned:', this.uploadResult);
        console.log('Uploading state:', this.uploading);
      },
      error: error => {
        console.error('Blob upload failed', error);
        
        this.errorMessage =
          error?.error?.detail ??
          error?.error?.message ??
          `Upload failed (HTTP ${error.status || 'network error'}).`;
        
          this.uploading = false;
        //this.cdr.detectChanges();
      },
      complete: () => {
        console.log('UPLOAD OBSERVABLE COMPLETED');
      }
    });
  }

  download(): void {
    const blobName = this.uploadResult?.blobName;

    if (!blobName || this.downloading) {
      return;
    }

    this.downloading = true;
    this.errorMessage = '';

    this.storageService.download(blobName).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = this.uploadResult?.originalFileName ?? 'download';
        link.click();

        URL.revokeObjectURL(url);
        this.downloading = false;
      },
      error: error => {
        console.error('Blob download failed', error);
        this.errorMessage =
          error?.error?.detail ??
          `Download failed (HTTP ${error.status || 'network error'}).`;
        this.downloading = false;
      }
    });
  }
}
