import { expect } from "@playwright/test"
import { testAsDirector, testAsTeacher } from "../../fixtures/auth.fixture"

testAsTeacher.describe("RBAC — TEACHER 제한", () => {
  testAsTeacher("TEACHER → /admin 접근 → /ko/students 리다이렉트", async ({ page }) => {
    await page.goto("/ko/admin")
    await expect(page).toHaveURL(/\/ko\/students/)
  })

  testAsTeacher("TEACHER → /teachers 접근 → 페이지 렌더링 또는 제한", async ({ page }) => {
    const response = await page.goto("/ko/teachers")
    // 미들웨어에서 /teachers가 protectedRoutes에 포함되어 있으므로 접근은 가능
    // 단, 서버 액션에서 RBAC 필터링이 적용됨
    expect(response?.status()).toBeLessThan(500)
  })
})

testAsDirector.describe("RBAC — DIRECTOR 접근", () => {
  testAsDirector("DIRECTOR → /teachers 접근 가능", async ({ page }) => {
    const response = await page.goto("/ko/teachers")
    expect(response?.status()).toBeLessThan(500)
  })

  testAsDirector("DIRECTOR → /admin 접근 가능", async ({ page }) => {
    await page.goto("/ko/admin")
    // admin 페이지가 리다이렉트되지 않고 렌더링
    await expect(page).not.toHaveURL(/\/ko\/students/)
  })
})
