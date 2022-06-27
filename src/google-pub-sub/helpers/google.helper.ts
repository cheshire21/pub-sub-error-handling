import { AxiosError } from 'axios';
import { google } from 'googleapis';
import { GoogleScope } from '../enums/google-scope.enum';

export interface GAxiosError extends AxiosError {
  code: string;
  config: AxiosError['config'];
  response: AxiosError['response'];
  errors: { message: string; domain: string; reason: string }[];
}

export const impersonatingAuth = (scopes: GoogleScope[]) => {
  return new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    keyId: process.env.GOOGLE_PRIVATE_KEY_ID,
    // Before adding scopes here, the scope has to be added to the Domain Wide Delegation scopes: https://admin.google.com/ac/owl/domainwidedelegation
    scopes,
    subject: process.env.GOOGLE_ADMIN_EMAIL, // We have to impersonate as an admin user
  });
};
