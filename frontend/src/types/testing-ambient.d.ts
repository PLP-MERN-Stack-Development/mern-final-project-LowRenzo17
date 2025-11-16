// Minimal ambient declarations to silence editor errors for test files when test deps are not installed.
// Prefer installing the real dev dependencies (vitest, @testing-library/react) to get full types.

declare module '@testing-library/react';
declare module '@testing-library/user-event';
declare module '@testing-library/jest-dom';
declare module 'vitest';
declare module 'vitest/config';

declare const describe: any;
declare const test: any;
declare const it: any;
declare const expect: any;
declare const beforeAll: any;
declare const afterAll: any;
declare const beforeEach: any;
declare const afterEach: any;
declare const vi: any;
