import {
    inject,
  Injectable
} from '@angular/core';

import {
  AuthenticationResult
} from '@azure/msal-browser';

import {
  MsalService
} from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class MsalInitializationService {
private readonly msalService = inject(MsalService);

  async initialize(): Promise<void> {

    await this.msalService.instance
      .initialize();

    const response:
      AuthenticationResult | null =
      await this.msalService.instance
        .handleRedirectPromise();

    if (response?.account) {

      this.msalService.instance
        .setActiveAccount(
          response.account
        );
    }
  }
}