import { expect } from "@playwright/test"
import { testAsTeacher } from "../../fixtures/auth.fixture"

testAsTeacher.describe("학생 상세", () => {
  testAsTeacher.beforeEach(async ({ page }) => {
    // 학생 목록에서 첫 번째 학생 상세로 이동
    await page.goto("/ko/students")
    await page.getByTestId("student-card").first().click()
    await page.waitForURL(/\/ko\/students\/[a-zA-Z0-9-]+/)
  })

  testAsTeacher("student-info 렌더링", async ({ page }) => {
    await expect(page.getByTestId("student-info")).toBeVisible()
  })

  testAsTeacher("탭 전환 — learning → analysis", async ({ page }) => {
    await page.getByTestId("analysis-tab").click()
    await expect(page).toHaveURL(/tab=analysis/)
  })

  testAsTeacher("탭 전환 — analysis → matching", async ({ page }) => {
    await page.getByTestId("matching-tab").click()
    await expect(page).toHaveURL(/tab=matching/)
    await expect(page.getByTestId("matching-tab-content")).toBeVisible()
  })

  testAsTeacher("탭 전환 — counseling 탭", async ({ page }) => {
    await page.getByTestId("counseling-tab").click()
    await expect(page).toHaveURL(/tab=counseling/)
    await expect(page.getByTestId("counseling-tab-content")).toBeVisible()
  })
})
