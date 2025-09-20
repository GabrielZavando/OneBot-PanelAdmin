// This file configures the test environment for Angular + Karma.
// It was missing in the project; Angular tests require Zone.js setup.

/*****************************************************************
 * BROWSER POLYFILLS
 * Zone.js is required by default for Angular testing.
 *****************************************************************/
import 'zone.js/plugins/task-tracking';
import 'zone.js/testing';

/*****************************************************************
 * Angular testing imports
 *****************************************************************/
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

// Initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Prevent Karma from starting tests until this file is loaded.
// (Karma will automatically discover and load all spec files.)
