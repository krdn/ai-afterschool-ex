import { expect } from "@playwright/test"
import { testAsTeacher } from "../../fixtures/auth.fixture"

testAsTeacher.describe("학생 등록", () => {
  testAsTeacher("필수 필드 입력 → 등록 성공", async ({ page }) => {
    await page.goto("/ko/students/new")

    await page.getByTestId("student-name-input").fill("테스트학생")
    await page.getByTestId("student-birthdate-input").fill("2008-01-01")
    await page.getByTestId("student-school-input").fill("테스트학교")
    await page.getByTestId("student-grade-select").selectOption("1")

    await page.getByTestId("submit-student-button").click()

    // 등록 성공 후 상세 페이지로 이동
    await expect(page).toHaveURL(/\/ko\/students\/[a-zA-Z0-9-]+/)
  })

  testAsTeacher("필수 필드 누락 → 유효성 에러", async ({ page }) => {
    await page.goto("/ko/students/new")

    // 이름만 입력하고 제출
    await page.getByTestId("student-name-input").fill("테스트학생")
    await page.getByTestId("submit-student-button").click()

    // 페이지가 이동하지 않아야 함 (유효성 에러)
    await expect(page).toHaveURL(/\/ko\/students\/new/)
  })
})
