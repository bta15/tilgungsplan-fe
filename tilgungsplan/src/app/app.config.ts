import {ApplicationConfig, importProvidersFrom, LOCALE_ID} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import { provideHttpClient, withFetch } from "@angular/common/http";
import {provideAnimations} from "@angular/platform-browser/animations";
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import {ReactiveFormsModule} from "@angular/forms";
import {provideMomentDateAdapter} from "@angular/material-moment-adapter";
import {registerLocaleData} from "@angular/common";
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';

export const DATE_FORMAT = {
  parse: {
    dateInput: 'MMM YYYY',
  },
  display: {
    dateInput: 'MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMM YYYY',
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations(),
    importProvidersFrom(MatNativeDateModule, ReactiveFormsModule),
    provideMomentDateAdapter(DATE_FORMAT),
    {provide: LOCALE_ID, useValue: 'de-DE'},
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'}
  ],
};

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

