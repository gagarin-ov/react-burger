import { existsSync } from 'node:fs';

import { defineConfig, devices } from '@playwright/test';

/**
 * Учётные данные для записи HAR (E2E_EMAIL / E2E_PASSWORD) можно положить
 * в .env.e2e — файл в .gitignore. Для обычного прогона тестов они не нужны.
 */
if (existsSync('.env.e2e')) {
  process.loadEnvFile('.env.e2e');
}

const BASE_URL = 'http://localhost:5173';

/**
 * Проект записи HAR ходит в реальное API и создаёт настоящий заказ,
 * поэтому подключается только явно: `npm run e2e:record`.
 */
const isRecording = Boolean(process.env.RECORD_HAR);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: BASE_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /.*\.record\.ts/,
    },
    ...(isRecording
      ? [
          {
            name: 'record-har',
            use: { ...devices['Desktop Chrome'] },
            testMatch: /.*\.record\.ts/,
            timeout: 120_000,
          },
        ]
      : []),
  ],

  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    env: { E2E: '1' },
  },
});
