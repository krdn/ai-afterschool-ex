import { expect } from "@playwright/test"
import { testAsTeacher } from "../../fixtures/auth.fixture"

testAsTeacher.describe("학생 목록", () => {
  testAsTeacher("학생 목록 렌더링 — student-card 존재", async ({ page }) => {
    await page.goto("/ko/students")
    await expect(page.getByTestId("student-card").first()).toBeVisible()
  })

  testAsTeacher("검색 — 이름으로 필터링", async ({ page }) => {
    await page.goto("/ko/students")
    await page.getByTestId("student-search-input").fill("홍길동")
    await page.getByTestId("student-search-button").click()
    await expect(page.getByTestId("student-card")).toHaveCount(1)
    await expect(page.getByTestId("student-name").first()).toContainText("홍길동")
  })

  testAsTeacher("카드 클릭 → 상세 페이지 이동", async ({ page }) => {
    await page.goto("/ko/students")
    await page.getByTestId("student-card").first().click()
    await expect(page).toHaveURL(/\/ko\/students\/[a-zA-Z0-9-]+/)
  })

  testAsTeacher("등록 버튼 → /students/new 이동", async ({ page }) => {
    await page.goto("/ko/students")
    await page.getByTestId("add-student-button").click()
    await expect(page).toHaveURL(/\/ko\/students\/new/)
  })
})
