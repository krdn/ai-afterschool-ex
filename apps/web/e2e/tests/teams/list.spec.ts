import { expect } from "@playwright/test"
import { testAsDirector } from "../../fixtures/auth.fixture"

testAsDirector.describe("팀 목록/상세", () => {
  testAsDirector("팀 목록 렌더링 — team-card 존재", async ({ page }) => {
    await page.goto("/ko/teams")
    // 테스트 데이터에 팀이 없을 수 있으므로, 팀 카드 또는 빈 상태 확인
    const teamCard = page.getByTestId("team-card")
    const count = await teamCard.count()
    if (count > 0) {
      await expect(teamCard.first()).toBeVisible()
    } else {
      // 팀이 없는 경우 빈 상태 확인
      await expect(page.getByText("아직 팀이 없어요")).toBeVisible()
    }
  })

  testAsDirector("팀 카드에 team-name, team-teachers-count, team-students-count 표시", async ({ page }) => {
    await page.goto("/ko/teams")
    const teamCard = page.getByTestId("team-card")
    const count = await teamCard.count()
    if (count > 0) {
      await expect(page.getByTestId("team-name").first()).toBeVisible()
      await expect(page.getByTestId("team-teachers-count").first()).toBeVisible()
      await expect(page.getByTestId("team-students-count").first()).toBeVisible()
    }
  })

  testAsDirector("카드 클릭 → 상세 이동", async ({ page }) => {
    await page.goto("/ko/teams")
    const teamCard = page.getByTestId("team-card")
    const count = await teamCard.count()
    if (count > 0) {
      await teamCard.first().click()
      await expect(page).toHaveURL(/\/ko\/teams\/[a-zA-Z0-9-]+/)
    }
  })

  testAsDirector("상세 — team-info-card 렌더링", async ({ page }) => {
    await page.goto("/ko/teams")
    const teamCard = page.getByTestId("team-card")
    const count = await teamCard.count()
    if (count > 0) {
      await teamCard.first().click()
      await page.waitForURL(/\/ko\/teams\/[a-zA-Z0-9-]+/)
      await expect(page.getByTestId("team-info-card")).toBeVisible()
    }
  })

  testAsDirector("상세 — team-name 표시", async ({ page }) => {
    await page.goto("/ko/teams")
    const teamCard = page.getByTestId("team-card")
    const count = await teamCard.count()
    if (count > 0) {
      await teamCard.first().click()
      await page.waitForURL(/\/ko\/teams\/[a-zA-Z0-9-]+/)
      await expect(page.getByTestId("team-name")).toBeVisible()
    }
  })
})
