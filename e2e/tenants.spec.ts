import { test, expect, type Page } from '@playwright/test'

const MOCK_TENANTS = [
  { id: 'a1b2c3d4-0000-0000-0000-000000000001', name: 'Acme Corp', slug: 'acme-corp', logoUrl: null, isActive: true },
  { id: 'a1b2c3d4-0000-0000-0000-000000000002', name: 'Beta Corp', slug: 'beta-corp', logoUrl: null, isActive: false },
]

async function seedAuthToken(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      'auth-tokens',
      JSON.stringify({ state: { token: 'test-token', refreshToken: 'test-refresh' }, version: 0 })
    )
  })
}

async function mockTenantsApi(page: Page, tenants = MOCK_TENANTS) {
  await page.route(/localhost:9999\/tenants/, async (route) => {
    const method = route.request().method()
    const url = route.request().url()
    const idMatch = url.match(/\/tenants\/([^/?]+)/)

    if (method === 'GET' && idMatch) {
      const tenant = tenants.find((t) => t.id === idMatch[1])
      if (tenant) {
        await route.fulfill({ json: { tenant } })
      } else {
        await route.fulfill({ status: 404, json: { title: 'Not Found' } })
      }
    } else if (method === 'GET') {
      await route.fulfill({
        json: { tenants: { data: tenants, count: tenants.length, pageIndex: 0, pageSize: 10 } },
      })
    } else if (method === 'POST') {
      const body = await route.request().postDataJSON()
      const newTenant = { id: crypto.randomUUID(), ...body }
      tenants.push(newTenant)
      await route.fulfill({ status: 201, json: { id: newTenant.id } })
    } else if (method === 'PUT') {
      const body = await route.request().postDataJSON()
      const idx = tenants.findIndex((t) => t.id === body.id)
      if (idx !== -1) tenants[idx] = { ...tenants[idx], ...body }
      await route.fulfill({ json: { isSuccess: true } })
    } else if (method === 'DELETE') {
      const id = idMatch?.[1]
      const idx = tenants.findIndex((t) => t.id === id)
      if (idx !== -1) tenants.splice(idx, 1)
      await route.fulfill({ json: { isSuccess: true } })
    }
  })
}

test.describe('Tenants page', () => {
  test.beforeEach(async ({ page }) => {
    await seedAuthToken(page)
    await mockTenantsApi(page)
  })

  test('navigates to tenants page and shows list', async ({ page }) => {
    await page.goto('/tenants')
    await expect(page.getByText('Acme Corp')).toBeVisible()
    await expect(page.getByText('Beta Corp')).toBeVisible()
  })

  test('shows New button on tenants page', async ({ page }) => {
    await page.goto('/tenants')
    await expect(page.getByTestId('new-tenant-button')).toBeVisible()
    await expect(page.getByText('Nieuw')).toBeVisible()
  })

  test('clicking New button opens the create modal', async ({ page }) => {
    await page.goto('/tenants')
    await page.getByTestId('new-tenant-button').click()
    await expect(page.getByText('Tenant aanmaken')).toBeVisible()
  })

  test('shows validation errors on empty form submit', async ({ page }) => {
    await page.goto('/tenants')
    await page.getByTestId('new-tenant-button').click()
    await expect(page.getByText('Tenant aanmaken')).toBeVisible()
    await page.getByTestId('save-tenant-button').click()
    await expect(page.getByTestId('name-error')).toBeVisible()
  })

  test('creates a new tenant successfully', async ({ page }) => {
    await page.goto('/tenants')
    await page.getByTestId('new-tenant-button').click()
    await expect(page.getByTestId('tenant-name-input')).toBeVisible()
    await page.getByTestId('tenant-name-input').fill('New Tenant')
    await page.getByTestId('tenant-slug-input').fill('new-tenant')
    await page.getByTestId('save-tenant-button').click()
    await expect(page.getByText('Tenant aanmaken')).not.toBeVisible({ timeout: 5000 })
  })

  test('opens edit modal with pre-filled data when editing', async ({ page }) => {
    await page.goto('/tenants')
    await expect(page.getByText('Acme Corp')).toBeVisible()
    const editButtons = page.locator('[aria-label="Bewerken"]')
    await editButtons.first().click()
    await expect(page.getByText('Tenant bewerken')).toBeVisible()
    await expect(page.getByTestId('tenant-name-input')).toHaveValue('Acme Corp')
  })
})
