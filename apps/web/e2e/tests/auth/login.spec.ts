import { test, expect } from "@playwright/test"
import { loginViaUI, TEST_USERS } from "../../helpers/auth"

test.describe("로그인 플로우", () => {
  test("유효한 자격 증명으로 로그인 성공 → /students 리다이렉트", async ({ page }) => {
    const { email, password } = TEST_USERS.teacher
    await loginViaUI(page, email, password)
    await expect(page).toHaveURL(/\/students/, { timeout: 15_000 })
  })

  test("잘못된 비밀번호 → form-error 표시", async ({ page }) => {
    await loginViaUI(page, TEST_USERS.teacher.email, "wrongpassword")
    await expect(page.getByTestId("form-error")).toBeVisible()
  })

  test("빈 폼 제출 → 유효성 검사 오류", async ({ page }) => {
    await page.goto("/ko/auth/login")
    await page.getByTestId("login-button").click()
    // 이메일 또는 비밀번호 에러가 표시되어야 함
    const emailError = page.getByTestId("email-error")
    const passwordError = page.getByTestId("password-error")
    await expect(emailError.or(passwordError).first()).toBeVisible()
  })

  test("미인증 상태에서 보호 페이지 접근 → /auth/login 리다이렉트", async ({ page }) => {
    await page.goto("/ko/students")
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test("인증 상태에서 /auth/login 접근 → /students 리다이렉트", async ({ page }) => {
    const { email, password } = TEST_USERS.teacher
    await loginViaUI(page, email, password)
    await expect(page).toHaveURL(/\/students/, { timeout: 15_000 })

    await page.goto("/ko/auth/login")
    await expect(page).toHaveURL(/\/students/)
  })

  test("존재하지 않는 이메일 → form-error 표시", async ({ page }) => {
    await loginViaUI(page, "nonexistent@test.com", "test1234")
    await expect(page.getByTestId("form-error")).toBeVisible()
  })
})
