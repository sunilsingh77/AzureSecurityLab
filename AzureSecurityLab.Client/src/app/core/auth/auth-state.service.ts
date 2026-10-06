import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { AccountInfo } from '@azure/msal-browser';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private readonly accountSubject = new BehaviorSubject<AccountInfo | null>(null);

  readonly account$ = this.accountSubject.asObservable();

  setAccount(account: AccountInfo | null): void {
    this.accountSubject.next(account);
  }

  get account(): AccountInfo | null {
    return this.accountSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.accountSubject.value !== null;
  }
}
