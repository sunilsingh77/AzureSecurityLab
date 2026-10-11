export const environment = {
  production: false,

  api: {
    //baseUrl: 'https://localhost:7125/api',
    baseUrl: 'https://azsecuritylab-api-sks77-2026.azurewebsites.net/api'
  },

  azureAd: {
    clientId: '02599e1f-817c-4187-b7bc-e3a5fd2f4b15',
    tenantId: '227a22ca-955a-45b7-ae6e-4b013467d116',
    authority: 'https://login.microsoftonline.com/227a22ca-955a-45b7-ae6e-4b013467d116',

    redirectUri: 'http://localhost:4200',

    postLogoutRedirectUri: 'http://localhost:4200',
  },

  apiScopes: {
    accessAsUser: 'api://f9961b48-ae65-425a-a067-6fb81ebf62d2/access_as_user',
  },
};
