import type { Page } from "@playwright/test"

export const TEST_USERS = {
  director: { email: "admin@test.com", password: "test1234" },
  teacher: { email: "teacher1@test.com", password: "test1234" },
} as const

/**
 * API를 통해 로그인하고 쿠키를 세팅
 */
export async function loginViaAPI(
  page: Page,
  user: keyof typeof TEST_USERS,
) {
  const { email, password } = TEST_USERS[user]
  const response = await page.request.post("/api/test-login", {
    data: { email, password },
  })
  if (!response.ok()) {
    throw new Error(`Login failed for ${email}: ${response.status()}`)
  }
}

/**
 * UI를 통해 로그인 (로그인 폼 동작 테스트용)
 */
export async function loginViaUI(
  page: Page,
  email: string,
  password: string,
) {
  await page.goto("/ko/auth/login")
  await page.getByTestId("email-input").fill(email)
  await page.getByTestId("password-input").fill(password)
  await page.getByTestId("login-button").click()
}

/**
 * 로그아웃
 */
export async function logout(page: Page) {
  await page.request.get("/ko/auth/logout")
}
