import { test as setup } from "@playwright/test"
import { loginViaAPI } from "../helpers/auth"

const DIRECTOR_FILE = "e2e/.auth/director.json"
const TEACHER_FILE = "e2e/.auth/teacher.json"

setup("authenticate as director", async ({ page }) => {
  await loginViaAPI(page, "director")
  await page.context().storageState({ path: DIRECTOR_FILE })
})

setup("authenticate as teacher", async ({ page }) => {
  await loginViaAPI(page, "teacher")
  await page.context().storageState({ path: TEACHER_FILE })
})
