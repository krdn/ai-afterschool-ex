# Phase 0: Monorepo 기반 구축 - 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Turborepo + pnpm workspace로 Monorepo 기반을 구축하고, 8개 패키지를 스캐폴딩하며, GitHub Actions CI를 설정한다.

**Architecture:** Turborepo 2.x가 빌드 오케스트레이션을 담당하고, pnpm 10 workspace가 패키지 의존성을 관리한다. 각 패키지는 tsup으로 빌드하며, apps/web은 Next.js 15를 사용한다. 모든 패키지는 `@ais/` 스코프를 사용한다.

**Tech Stack:** Turborepo 2.x, pnpm 10, tsup, TypeScript 5, Vitest, Next.js 15, GitHub Actions

---

## Task 1: 루트 설정 파일 생성

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `tsconfig.base.json`
- Create: `.npmrc`

**Step 1: 루트 package.json 생성**

```json
{
  "name": "ai-afterschool-ex",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "test:e2e": "turbo run test:e2e",
    "typecheck": "turbo run typecheck",
    "clean": "turbo run clean && rm -rf node_modules",
    "db:generate": "turbo run db:generate",
    "db:push": "turbo run db:push",
    "db:seed": "turbo run db:seed",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\""
  },
  "devDependencies": {
    "turbo": "^2",
    "prettier": "^3",
    "@changesets/cli": "^2"
  },
  "engines": {
    "node": ">=24"
  },
  "packageManager": "pnpm@10.28.2"
}
```

**Step 2: pnpm-workspace.yaml 생성**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**Step 3: turbo.json 생성**

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "test:e2e": {
      "dependsOn": ["build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    },
    "db:generate": {
      "cache": false
    },
    "db:push": {
      "cache": false
    },
    "db:seed": {
      "cache": false
    }
  }
}
```

**Step 4: tsconfig.base.json 생성**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "composite": false,
    "forceConsistentCasingInFileNames": true
  },
  "exclude": ["node_modules", "dist"]
}
```

**Step 5: .npmrc 생성**

```
auto-install-peers=true
strict-peer-dependencies=false
```

**Step 6: 의존성 설치 테스트**

Run: `pnpm install`
Expected: turbo, prettier 설치 성공

**Step 7: 커밋**

```bash
git add package.json pnpm-workspace.yaml turbo.json tsconfig.base.json .npmrc pnpm-lock.yaml
git commit -m "chore: Monorepo 루트 설정 (Turborepo + pnpm workspace)"
```

---

## Task 2: @ais/shared 패키지 스캐폴딩

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/tsup.config.ts`
- Create: `packages/shared/src/index.ts`
- Create: `packages/shared/src/types/index.ts`
- Create: `packages/shared/src/utils/index.ts`
- Create: `packages/shared/src/constants/index.ts`

**Step 1: package.json 생성**

```json
{
  "name": "@ais/shared",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./dist/index.js"
    },
    "./types": {
      "types": "./src/types/index.ts",
      "import": "./dist/types/index.js"
    },
    "./utils": {
      "types": "./src/utils/index.ts",
      "import": "./dist/utils/index.js"
    },
    "./constants": {
      "types": "./src/constants/index.ts",
      "import": "./dist/constants/index.js"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "tsup": "^8",
    "typescript": "^5"
  }
}
```

**Step 2: tsconfig.json 생성**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

**Step 3: tsup.config.ts 생성**

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/types/index.ts",
    "src/utils/index.ts",
    "src/constants/index.ts",
  ],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
});
```

**Step 4: 플레이스홀더 소스 파일 생성**

`packages/shared/src/index.ts`:
```typescript
export * from "./types/index.js";
export * from "./utils/index.js";
export * from "./constants/index.js";
```

`packages/shared/src/types/index.ts`:
```typescript
// 향후 Phase 1에서 원본 프로젝트의 타입 정의가 이동됩니다
export type Placeholder = "shared-types";
```

`packages/shared/src/utils/index.ts`:
```typescript
// 향후 Phase 1에서 원본 프로젝트의 유틸리티가 이동됩니다
export function placeholder(): string {
  return "shared-utils";
}
```

`packages/shared/src/constants/index.ts`:
```typescript
// 향후 Phase 1에서 원본 프로젝트의 상수가 이동됩니다
export const PACKAGE_NAME = "@ais/shared";
```

**Step 5: 빌드 테스트**

Run: `pnpm --filter @ais/shared build`
Expected: dist/ 디렉토리에 JS + .d.ts 파일 생성

**Step 6: 커밋**

```bash
git add packages/shared/
git commit -m "chore: @ais/shared 패키지 스캐폴딩"
```

---

## Task 3: @ais/db 패키지 스캐폴딩

**Files:**
- Create: `packages/db/package.json`
- Create: `packages/db/tsconfig.json`
- Create: `packages/db/tsup.config.ts`
- Create: `packages/db/src/index.ts`
- Create: `packages/db/src/client.ts`

**Step 1: package.json 생성**

```json
{
  "name": "@ais/db",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./dist/index.js"
    },
    "./client": {
      "types": "./src/client.ts",
      "import": "./dist/client.js"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist",
    "db:generate": "echo 'Prisma generate will be configured in Phase 2'",
    "db:push": "echo 'Prisma push will be configured in Phase 2'",
    "db:seed": "echo 'Seed will be configured in Phase 2'"
  },
  "dependencies": {
    "@ais/shared": "workspace:*"
  },
  "devDependencies": {
    "tsup": "^8",
    "typescript": "^5"
  }
}
```

**Step 2: tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

**Step 3: tsup.config.ts**

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/client.ts"],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
});
```

**Step 4: 소스 파일 생성**

`packages/db/src/index.ts`:
```typescript
export { db } from "./client.js";
```

`packages/db/src/client.ts`:
```typescript
// 향후 Phase 2에서 Prisma Client가 설정됩니다
// 현재는 플레이스홀더
export const db = null as unknown;
```

**Step 5: 빌드 테스트**

Run: `pnpm --filter @ais/db build`
Expected: 성공

**Step 6: 커밋**

```bash
git add packages/db/
git commit -m "chore: @ais/db 패키지 스캐폴딩"
```

---

## Task 4: @ais/ai-engine 패키지 스캐폴딩

**Files:**
- Create: `packages/ai-engine/package.json`
- Create: `packages/ai-engine/tsconfig.json`
- Create: `packages/ai-engine/tsup.config.ts`
- Create: `packages/ai-engine/src/index.ts`
- Create: `packages/ai-engine/src/adapters/index.ts`
- Create: `packages/ai-engine/src/router/index.ts`
- Create: `packages/ai-engine/src/prompts/index.ts`

**Step 1: package.json 생성**

```json
{
  "name": "@ais/ai-engine",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./dist/index.js"
    },
    "./adapters": {
      "types": "./src/adapters/index.ts",
      "import": "./dist/adapters/index.js"
    },
    "./router": {
      "types": "./src/router/index.ts",
      "import": "./dist/router/index.js"
    },
    "./prompts": {
      "types": "./src/prompts/index.ts",
      "import": "./dist/prompts/index.js"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@ais/shared": "workspace:*",
    "@ais/db": "workspace:*"
  },
  "devDependencies": {
    "tsup": "^8",
    "typescript": "^5"
  }
}
```

**Step 2: tsconfig.json, tsup.config.ts** (동일 패턴)

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/adapters/index.ts",
    "src/router/index.ts",
    "src/prompts/index.ts",
  ],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
});
```

**Step 3: 플레이스홀더 소스 파일**

`packages/ai-engine/src/index.ts`:
```typescript
export * from "./adapters/index.js";
export * from "./router/index.js";
export * from "./prompts/index.js";
```

`packages/ai-engine/src/adapters/index.ts`:
```typescript
// 향후 Phase 5에서 13+ LLM 어댑터가 이동됩니다
export const ADAPTERS_PLACEHOLDER = true;
```

`packages/ai-engine/src/router/index.ts`:
```typescript
// 향후 Phase 5에서 유니버설 라우터가 이동됩니다
export const ROUTER_PLACEHOLDER = true;
```

`packages/ai-engine/src/prompts/index.ts`:
```typescript
// 향후 Phase 5에서 모든 프롬프트가 이동됩니다
export const PROMPTS_PLACEHOLDER = true;
```

**Step 4: 빌드 테스트**

Run: `pnpm --filter @ais/ai-engine build`
Expected: 성공

**Step 5: 커밋**

```bash
git add packages/ai-engine/
git commit -m "chore: @ais/ai-engine 패키지 스캐폴딩"
```

---

## Task 5: @ais/analysis 패키지 스캐폴딩

**Files:**
- Create: `packages/analysis/package.json`
- Create: `packages/analysis/tsconfig.json`
- Create: `packages/analysis/tsup.config.ts`
- Create: `packages/analysis/src/index.ts`
- Create: `packages/analysis/src/saju/index.ts`
- Create: `packages/analysis/src/name/index.ts`
- Create: `packages/analysis/src/mbti/index.ts`
- Create: `packages/analysis/src/vark/index.ts`
- Create: `packages/analysis/src/zodiac/index.ts`
- Create: `packages/analysis/src/compatibility/index.ts`
- Create: `packages/analysis/src/integration/index.ts`

**Step 1: package.json 생성**

```json
{
  "name": "@ais/analysis",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./dist/index.js"
    },
    "./saju": {
      "types": "./src/saju/index.ts",
      "import": "./dist/saju/index.js"
    },
    "./name": {
      "types": "./src/name/index.ts",
      "import": "./dist/name/index.js"
    },
    "./mbti": {
      "types": "./src/mbti/index.ts",
      "import": "./dist/mbti/index.js"
    },
    "./vark": {
      "types": "./src/vark/index.ts",
      "import": "./dist/vark/index.js"
    },
    "./zodiac": {
      "types": "./src/zodiac/index.ts",
      "import": "./dist/zodiac/index.js"
    },
    "./compatibility": {
      "types": "./src/compatibility/index.ts",
      "import": "./dist/compatibility/index.js"
    },
    "./integration": {
      "types": "./src/integration/index.ts",
      "import": "./dist/integration/index.js"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@ais/shared": "workspace:*"
  },
  "devDependencies": {
    "tsup": "^8",
    "typescript": "^5",
    "vitest": "^4"
  }
}
```

**Step 2: tsconfig.json, tsup.config.ts**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/saju/index.ts",
    "src/name/index.ts",
    "src/mbti/index.ts",
    "src/vark/index.ts",
    "src/zodiac/index.ts",
    "src/compatibility/index.ts",
    "src/integration/index.ts",
  ],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
});
```

**Step 3: 플레이스홀더 소스 파일**

각 서브 모듈(`saju`, `name`, `mbti`, `vark`, `zodiac`, `compatibility`, `integration`)에 `index.ts`:

```typescript
// 향후 Phase 4에서 원본 프로젝트의 분석 알고리즘이 이동됩니다
export const PLACEHOLDER = true;
```

`packages/analysis/src/index.ts`:
```typescript
export * from "./saju/index.js";
export * from "./name/index.js";
export * from "./mbti/index.js";
export * from "./vark/index.js";
export * from "./zodiac/index.js";
export * from "./compatibility/index.js";
export * from "./integration/index.js";
```

**Step 4: 빌드 테스트**

Run: `pnpm --filter @ais/analysis build`
Expected: 성공

**Step 5: 커밋**

```bash
git add packages/analysis/
git commit -m "chore: @ais/analysis 패키지 스캐폴딩"
```

---

## Task 6: @ais/matching, @ais/counseling, @ais/report 패키지 스캐폴딩

**Files:**
- Create: `packages/matching/` (package.json, tsconfig.json, tsup.config.ts, src/index.ts)
- Create: `packages/counseling/` (동일 구조)
- Create: `packages/report/` (동일 구조)

**Step 1: @ais/matching package.json**

```json
{
  "name": "@ais/matching",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@ais/shared": "workspace:*",
    "@ais/db": "workspace:*",
    "@ais/analysis": "workspace:*"
  },
  "devDependencies": {
    "tsup": "^8",
    "typescript": "^5",
    "vitest": "^4"
  }
}
```

**Step 2: @ais/counseling package.json**

```json
{
  "name": "@ais/counseling",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@ais/shared": "workspace:*",
    "@ais/db": "workspace:*"
  },
  "devDependencies": {
    "tsup": "^8",
    "typescript": "^5",
    "vitest": "^4"
  }
}
```

**Step 3: @ais/report package.json**

```json
{
  "name": "@ais/report",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@ais/shared": "workspace:*",
    "@ais/db": "workspace:*"
  },
  "devDependencies": {
    "tsup": "^8",
    "typescript": "^5",
    "vitest": "^4"
  }
}
```

**Step 4: 3개 패키지 모두 tsconfig.json, tsup.config.ts, src/index.ts 생성** (Task 2와 동일 패턴)

각 패키지의 `src/index.ts`:
```typescript
// 향후 해당 Phase에서 원본 코드가 이동됩니다
export const PACKAGE_NAME = "@ais/<name>";
```

**Step 5: 빌드 테스트**

Run: `pnpm --filter "@ais/matching" --filter "@ais/counseling" --filter "@ais/report" build`
Expected: 3개 패키지 모두 성공

**Step 6: 커밋**

```bash
git add packages/matching/ packages/counseling/ packages/report/
git commit -m "chore: @ais/matching, @ais/counseling, @ais/report 패키지 스캐폴딩"
```

---

## Task 7: @ais/ui 패키지 스캐폴딩

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`
- Create: `packages/ui/tsup.config.ts`
- Create: `packages/ui/src/index.ts`
- Create: `packages/ui/src/primitives/index.ts`
- Create: `packages/ui/src/composites/index.ts`

**Step 1: package.json 생성**

```json
{
  "name": "@ais/ui",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./dist/index.js"
    },
    "./primitives": {
      "types": "./src/primitives/index.ts",
      "import": "./dist/primitives/index.js"
    },
    "./composites": {
      "types": "./src/composites/index.ts",
      "import": "./dist/composites/index.js"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@ais/shared": "workspace:*"
  },
  "peerDependencies": {
    "react": "^19",
    "react-dom": "^19"
  },
  "devDependencies": {
    "tsup": "^8",
    "typescript": "^5",
    "react": "^19",
    "react-dom": "^19",
    "@types/react": "^19",
    "@types/react-dom": "^19"
  }
}
```

**Step 2: tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
  },
  "include": ["src"]
}
```

**Step 3: tsup.config.ts**

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/primitives/index.ts",
    "src/composites/index.ts",
  ],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  external: ["react", "react-dom"],
});
```

**Step 4: 플레이스홀더 소스 파일**

`packages/ui/src/index.ts`:
```typescript
export * from "./primitives/index.js";
export * from "./composites/index.js";
```

`packages/ui/src/primitives/index.ts`:
```typescript
// 향후 Phase 3에서 Radix UI 래퍼가 이동됩니다
export const UI_PRIMITIVES_PLACEHOLDER = true;
```

`packages/ui/src/composites/index.ts`:
```typescript
// 향후 Phase 3에서 복합 컴포넌트가 이동됩니다
export const UI_COMPOSITES_PLACEHOLDER = true;
```

**Step 5: 빌드 테스트**

Run: `pnpm --filter @ais/ui build`
Expected: 성공

**Step 6: 커밋**

```bash
git add packages/ui/
git commit -m "chore: @ais/ui 패키지 스캐폴딩"
```

---

## Task 8: apps/web 스캐폴딩 (빈 Next.js 앱)

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/next.config.ts`
- Create: `apps/web/src/app/layout.tsx`
- Create: `apps/web/src/app/page.tsx`

**Step 1: package.json 생성**

```json
{
  "name": "@ais/web",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf .next"
  },
  "dependencies": {
    "@ais/shared": "workspace:*",
    "@ais/db": "workspace:*",
    "@ais/ai-engine": "workspace:*",
    "@ais/analysis": "workspace:*",
    "@ais/matching": "workspace:*",
    "@ais/counseling": "workspace:*",
    "@ais/report": "workspace:*",
    "@ais/ui": "workspace:*",
    "next": "^15",
    "react": "^19",
    "react-dom": "^19"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5"
  }
}
```

**Step 2: tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": true,
    "noEmit": true,
    "module": "ESNext",
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

**Step 3: next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@ais/shared",
    "@ais/db",
    "@ais/ai-engine",
    "@ais/analysis",
    "@ais/matching",
    "@ais/counseling",
    "@ais/report",
    "@ais/ui",
  ],
};

export default nextConfig;
```

**Step 4: 기본 페이지 생성**

`apps/web/src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI AfterSchool",
  description: "AI 학원 관리 시스템",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
```

`apps/web/src/app/page.tsx`:
```tsx
import { PACKAGE_NAME } from "@ais/shared";

export default function Home() {
  return (
    <main>
      <h1>AI AfterSchool</h1>
      <p>Monorepo 구축 완료 - shared 패키지 연결: {PACKAGE_NAME}</p>
    </main>
  );
}
```

**Step 5: 빌드 테스트**

Run: `pnpm install && pnpm --filter @ais/web build`
Expected: Next.js 빌드 성공, @ais/shared import 정상

**Step 6: 커밋**

```bash
git add apps/web/
git commit -m "chore: apps/web Next.js 앱 스캐폴딩"
```

---

## Task 9: 전체 빌드 검증 및 .gitignore 업데이트

**Files:**
- Modify: `.gitignore`

**Step 1: .gitignore에 Turborepo 관련 항목 추가**

`.gitignore`에 추가:
```
# Turborepo
.turbo/

# Build outputs
dist/
.next/
out/

# Dependencies
node_modules/

# Environment
.env
.env.*
!.env.example

# IDE
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
```

**Step 2: 전체 빌드 테스트**

Run: `pnpm install && pnpm build`
Expected: 모든 8개 패키지 + apps/web 빌드 성공, Turborepo가 의존성 순서대로 실행

**Step 3: turbo 캐시 테스트**

Run: `pnpm build` (두 번째 실행)
Expected: 캐시 히트로 즉시 완료 ("FULL TURBO" 표시)

**Step 4: 커밋**

```bash
git add .gitignore
git commit -m "chore: .gitignore Turborepo 관련 항목 추가"
```

---

## Task 10: GitHub Actions CI 파이프라인

**Files:**
- Create: `.github/workflows/ci.yml`

**Step 1: CI 워크플로우 생성**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    name: Build & Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Lint
        run: pnpm lint

      - name: TypeCheck
        run: pnpm typecheck

      - name: Test
        run: pnpm test
```

**Step 2: 커밋**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: GitHub Actions CI 파이프라인 추가"
```

---

## Task 11: README 업데이트 및 최종 푸시

**Files:**
- Modify: `README.md`

**Step 1: README.md 업데이트**

```markdown
# AI AfterSchool EX

> AI 학원 관리 시스템 - Turborepo Monorepo 아키텍처

## 프로젝트 구조

```
apps/
  web/          - Next.js 15 프론트엔드

packages/
  @ais/shared      - 공유 타입/유틸/Zod 스키마
  @ais/db          - Prisma 스키마 + 리포지토리
  @ais/ui          - UI 컴포넌트 (Radix UI)
  @ais/analysis    - 분석 알고리즘 (사주, MBTI 등)
  @ais/ai-engine   - AI 통합 (13+ LLM 어댑터)
  @ais/matching    - 매칭 & 배치 최적화
  @ais/counseling  - 상담 관리
  @ais/report      - 보고서 생성 (PDF)
```

## 빠른 시작

\`\`\`bash
pnpm install
pnpm build
pnpm dev
\`\`\`

## 기술 스택

- **Monorepo**: Turborepo + pnpm workspace
- **Frontend**: Next.js 15, React 19, TypeScript 5
- **Build**: tsup (esbuild 기반)
- **Test**: Vitest + Playwright

## 문서

- [아키텍처 설계서](docs/plans/2026-02-19-monorepo-architecture-design.md)
- [Phase 0 구현 계획](docs/plans/2026-02-19-phase0-monorepo-setup.md)
```

**Step 2: 최종 커밋 및 푸시**

```bash
git add README.md
git commit -m "docs: README 업데이트 - Monorepo 구조 설명"
git push origin main
```

**Step 3: GitHub Issue #3 (Phase 0) 닫기**

```bash
gh issue close 3 --comment "Phase 0 완료: Monorepo 기반 구축 완료"
```

---

## 검증 체크리스트

Phase 0 완료 후 다음을 확인:

- [ ] `pnpm install` 성공
- [ ] `pnpm build` 성공 (8개 패키지 + apps/web)
- [ ] 두 번째 `pnpm build`에서 Turborepo 캐시 히트
- [ ] `pnpm --filter @ais/web dev` 실행 시 localhost:3000 정상
- [ ] @ais/shared import가 apps/web에서 정상 동작
- [ ] GitHub Actions CI 통과
- [ ] 모든 패키지의 workspace:* 의존성 정상
