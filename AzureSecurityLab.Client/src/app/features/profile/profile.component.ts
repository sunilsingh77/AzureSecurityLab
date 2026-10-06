import { Component, inject, OnInit } from '@angular/core';

import { AccountInfo } from '@azure/msal-browser';

import { AuthService } from '../../core/auth/auth.service';

import { SecurityApiService, SecurityProfile } from '../../services/security-api.service';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  account: AccountInfo | null = null;

  profile: SecurityProfile | null = null;

  loading = false;

  error: string | null = null;

  private readonly authService = inject(AuthService);
  private readonly securityApi = inject(SecurityApiService);

  ngOnInit(): void {
    this.account = this.authService.getActiveAccount();

    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;

    this.error = null;

    this.securityApi.getProfile().subscribe({
      next: (response) => {
        this.profile = response;

        this.loading = false;
      },

      error: (error) => {
        console.error('Profile API error:', error);

        this.error = 'Unable to load profile from API.';

        this.loading = false;
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
