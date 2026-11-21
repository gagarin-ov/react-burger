import { type Page } from '@playwright/test';

import { API_URL, HAR } from './har';

export async function mockApi(page: Page): Promise<void> {
  await page.route(`${API_URL}/**`, (route) => route.abort());
  await page.routeFromHAR(HAR.ingredients, {
    url: `${API_URL}/ingredients`,
    notFound: 'fallback',
  });
  await page.routeFromHAR(HAR.orders, {
    url: `${API_URL}/orders`,
    notFound: 'fallback',
  });
  await page.routeFromHAR(HAR.user, {
    url: `${API_URL}/auth/user`,
    notFound: 'fallback',
  });
}

export async function mockAuth(page: Page, baseURL: string): Promise<void> {
  await page
    .context()
    .addCookies([
      { name: 'accessToken', value: 'Bearer fake-access-token', url: baseURL },
    ]);
  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'fake-refresh-token');
  });
}
