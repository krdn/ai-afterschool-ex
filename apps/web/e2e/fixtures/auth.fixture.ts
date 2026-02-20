import { test as base } from "@playwright/test"

export const testAsDirector = base.extend({
  storageState: ["e2e/.auth/director.json", { option: true }],
})

export const testAsTeacher = base.extend({
  storageState: ["e2e/.auth/teacher.json", { option: true }],
})
