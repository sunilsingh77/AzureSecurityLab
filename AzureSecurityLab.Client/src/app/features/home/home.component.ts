import { Component, inject } from '@angular/core';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-home',

  standalone: true,

  templateUrl: './home.component.html',

  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly authService = inject(AuthService);

  login(): void {
    this.authService.login();
  }
}
