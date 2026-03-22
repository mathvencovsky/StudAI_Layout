# TODO

## Post-deployment Google OAuth configuration (main branch)

- [ ] Add Cognito user pool domain to Google OAuth client
  - Google Cloud Console → APIs & Services → Credentials → select the OAuth client
  - Add the Cognito user pool domain to **Authorized JavaScript origins**
  - Add `https://<user-pool-domain>/oauth2/idpresponse` to **Authorized redirect URIs**
