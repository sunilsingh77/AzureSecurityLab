import {
  inject,
  Injectable
} from '@angular/core';

import {
  MsalService
} from '@azure/msal-angular';

import {
  AccountInfo,
  AuthenticationResult,
  SilentRequest
} from '@azure/msal-browser';

import {
  environment
} from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly msalService = inject(MsalService);

  login(): void {

    this.msalService.loginRedirect({

      scopes: [
        'openid',
        'profile',
        'email'
      ]

    });
  }


  logout(): void {

    this.msalService.logoutRedirect({

      postLogoutRedirectUri:
        environment.azureAd
          .postLogoutRedirectUri

    });
  }


  getActiveAccount():
    AccountInfo | null {

    return this.msalService
      .instance
      .getActiveAccount();
  }


  getAllAccounts():
    AccountInfo[] {

    return this.msalService
      .instance
      .getAllAccounts();
  }


  setActiveAccount(
    account: AccountInfo
  ): void {

    this.msalService
      .instance
      .setActiveAccount(account);
  }


  isAuthenticated(): boolean {

    return this.getActiveAccount()
      !== null;
  }


  async getApiAccessToken():
    Promise<string> {

    const account =
      this.getActiveAccount();

    if (!account) {

      throw new Error(
        'No active account found.'
      );
    }


    const request:
      SilentRequest = {

      account,

      scopes: [
        environment.apiScopes
          .accessAsUser
      ]
    };


    const result:
      AuthenticationResult =

      await this.msalService
        .instance
        .acquireTokenSilent(request);


    return result.accessToken;
  }
}