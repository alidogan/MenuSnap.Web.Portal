import { test, expect, type Page } from '@playwright/test'

async function seedAuthToken(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      'auth-tokens',
      JSON.stringify({ state: { token: 'test-token', refreshToken: 'test-refresh' }, version: 0 })
    )
  })
}

test.describe('Admin overview page', () => {
  test.beforeEach(async ({ page }) => {
    await seedAuthToken(page)
  })

  test('navigates to /admin and shows Tenants card', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.getByTestId('admin-item-tenants')).toBeVisible()
  })

  test('clicking Tenants card navigates to /admin/tenants', async ({ page }) => {
    await page.route(/localhost:9999\/tenants/, async (route) => {
      await route.fulfill({
        json: { tenants: { data: [], count: 0, pageIndex: 0, pageSize: 10 } },
      })
    })

    await page.goto('/admin')
    await page.getByTestId('admin-item-tenants').click()
    await expect(page).toHaveURL(/\/admin\/tenants/)
  })
})
