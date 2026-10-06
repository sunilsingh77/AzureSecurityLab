import { Component, inject, OnInit } from '@angular/core';

import { RouterLink, RouterOutlet } from '@angular/router';

import { MsalBroadcastService, MsalService } from '@azure/msal-angular';

import { InteractionStatus } from '@azure/msal-browser';

import { filter } from 'rxjs/operators';

import { AuthStateService } from './core/auth/auth-state.service';

@Component({
  selector: 'app-root',

  standalone: true,

  imports: [RouterOutlet, RouterLink],

  templateUrl: './app.component.html',

  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly msalService = inject(MsalService);
  private readonly msalBroadcastService = inject(MsalBroadcastService);
  private readonly authStateService = inject(AuthStateService);

  ngOnInit(): void {
    this.msalBroadcastService.inProgress$

      .pipe(filter((status) => status === InteractionStatus.None))

      .subscribe(() => {
        this.setActiveAccount();
      });
  }

  private setActiveAccount(): void {
    const activeAccount = this.msalService.instance.getActiveAccount();

    if (activeAccount) {
      this.authStateService.setAccount(activeAccount);

      return;
    }

    const accounts = this.msalService.instance.getAllAccounts();

    if (accounts.length === 1) {
      this.msalService.instance.setActiveAccount(accounts[0]);

      this.authStateService.setAccount(accounts[0]);
    }
  }
}
