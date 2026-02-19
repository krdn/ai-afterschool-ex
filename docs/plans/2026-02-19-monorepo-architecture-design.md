# AI AfterSchool - Monorepo 아키텍처 설계서

> **작성일**: 2026-02-19
> **상태**: 승인됨
> **접근법**: A - 패키지 중심 분리 (Turborepo + pnpm workspace)

---

## 1. 프로젝트 개요

### 1.1 현재 상태

AI AfterSchool은 Next.js 15 기반의 **모놀리식 학원 관리 시스템**으로, 다음과 같은 핵심 기능을 포함합니다:

| 항목 | 규모 |
|------|------|
| Prisma 모델 | 40+ |
| 페이지/라우트 | 50+ |
| 컴포넌트 | 100+ |
| Server Actions | 60+ |
| AI 어댑터 | 13개 (Claude, OpenAI, Google 등) |
| 분석 유형 | 7가지 (사주, 성명학, MBTI, VARK, 관상, 손금, 띠) |
| 도메인 영역 | 12개 |

### 1.2 변경 목표

| 목적 | 설명 |
|------|------|
| 독립 배포 & 스케일링 | 각 기능을 독립적으로 배포하고, 부하가 높은 서비스만 스케일 아웃 |
| 재사용 & 모듈화 | AI 엔진, 분석 알고리즘 등을 다른 프로젝트에서 npm 패키지로 재사용 |
| AI 자율 관리 | Claude Code가 24/7 모니터링, 자동 수정, 배포까지 수행 |
| 학습 & 포트폴리오 | Monorepo + Turborepo 아키텍처 경험 축적 |

### 1.3 제약 조건

- **개발 체제**: 1인 + Claude Code (AI가 PM 역할)
- **배포 환경**: 로컬 서버 (192.168.0.5) Docker Compose
- **기존 서비스와 공존**: 동일 서버에 n8n, gonsai2, home-krdn 등 운영 중

---

## 2. 전체 아키텍처

### 2.1 디렉토리 구조

```
ai-afterschool-ex/                     # Monorepo (Turborepo)
│
├─ apps/
│  └─ web/                             # Next.js 15 앱 (슬림화된 모놀리스)
│     ├─ src/app/                      # 라우트, 페이지, 레이아웃
│     ├─ src/components/               # UI 컴포넌트 (도메인별)
│     ├─ src/lib/actions/              # Server Actions (얇은 오케스트레이션)
│     ├─ src/lib/hooks/                # React 훅
│     └─ package.json                  # @ais/* 패키지를 의존성으로 사용
│
├─ packages/
│  ├─ @ais/db                          # 데이터 계층
│  │  ├─ prisma/schema.prisma          # 전체 Prisma 스키마
│  │  ├─ src/client.ts                 # PrismaClient 싱글톤
│  │  ├─ src/seed/                     # 시드 데이터
│  │  └─ src/repositories/             # 도메인별 리포지토리
│  │
│  ├─ @ais/ai-engine                   # AI 통합 레이어
│  │  ├─ src/adapters/                 # 13+ LLM 어댑터
│  │  ├─ src/router/                   # 유니버설 라우터, 스마트 라우팅
│  │  ├─ src/prompts/                  # 모든 프롬프트
│  │  ├─ src/usage/                    # 사용량 추적, 예산 관리
│  │  └─ src/encryption.ts             # API 키 암호화
│  │
│  ├─ @ais/analysis                    # 분석 알고리즘 (순수 로직)
│  │  ├─ src/saju/                     # 사주 (절기, 간지, 십성)
│  │  ├─ src/name/                     # 성명학 (획수, 수리)
│  │  ├─ src/mbti/                     # MBTI 점수
│  │  ├─ src/vark/                     # VARK 학습 스타일
│  │  ├─ src/zodiac/                   # 띠/별자리
│  │  ├─ src/compatibility/            # 호환성 점수
│  │  └─ src/integration/              # 통합 성향 분석
│  │
│  ├─ @ais/matching                    # 매칭 & 배치 최적화
│  │  ├─ src/auto-assignment.ts        # 자동 배치
│  │  ├─ src/fairness.ts               # 공정성 지표
│  │  └─ src/team-composition.ts       # 팀 구성 분석
│  │
│  ├─ @ais/counseling                  # 상담 관리
│  │  ├─ src/sessions.ts               # 상담 세션 CRUD
│  │  ├─ src/reservations.ts           # 학부모 상담 예약
│  │  ├─ src/satisfaction.ts           # 만족도 조사
│  │  ├─ src/ai-summary.ts             # AI 상담 요약
│  │  └─ src/stats.ts                  # 상담 통계
│  │
│  ├─ @ais/report                      # 보고서 생성
│  │  ├─ src/generator.ts              # PDF 생성
│  │  ├─ src/templates/                # 보고서 템플릿
│  │  └─ src/fonts.ts                  # 폰트 설정
│  │
│  ├─ @ais/shared                      # 공유 모듈
│  │  ├─ src/types/                    # 도메인 타입 정의
│  │  ├─ src/validations/              # Zod 스키마
│  │  ├─ src/utils/                    # 유틸리티
│  │  ├─ src/errors/                   # 에러 타입
│  │  └─ src/constants/                # 상수
│  │
│  └─ @ais/ui                          # 공유 UI 컴포넌트
│     ├─ src/primitives/               # Radix UI 래퍼
│     └─ src/composites/               # 복합 컴포넌트
│
├─ docker/
│  ├─ Dockerfile.web                   # Next.js 빌드
│  └─ docker-compose.yml               # 통합 배포
│
├─ .github/
│  └─ workflows/
│     ├─ ci.yml                        # CI 파이프라인
│     ├─ deploy.yml                    # 자동 배포
│     └─ ai-autopilot.yml             # AI 자율 관리
│
├─ turbo.json
├─ pnpm-workspace.yaml
├─ package.json
└─ tsconfig.base.json
```

### 2.2 패키지 요약

| 패키지 | 역할 | 핵심 모듈 | 재사용 가능성 |
|--------|------|----------|-------------|
| `@ais/db` | 데이터 계층 | Prisma 스키마, 리포지토리 | 프로젝트 전용 |
| `@ais/ai-engine` | AI 통합 | 13+ 어댑터, 라우터, 프롬프트 | **높음** (범용 LLM 허브) |
| `@ais/analysis` | 분석 알고리즘 | 사주, 성명학, MBTI, VARK 등 | **높음** (순수 로직) |
| `@ais/matching` | 매칭 최적화 | 자동 배치, 공정성 | 중간 |
| `@ais/counseling` | 상담 관리 | 세션, 예약, 만족도 | 중간 |
| `@ais/report` | 보고서 생성 | PDF 생성, 템플릿 | 중간 |
| `@ais/shared` | 공유 기반 | 타입, Zod, 유틸 | **높음** |
| `@ais/ui` | UI 컴포넌트 | Radix 래퍼, 복합 컴포넌트 | **높음** |

---

## 3. 패키지 의존성 규칙

### 3.1 의존성 그래프

```
                    ┌──────────┐
                    │ @ais/ui  │  (의존: @ais/shared만)
                    └──────────┘

               ┌────────────────┐
               │  @ais/shared   │  (의존성 없음 - 리프 노드)
               └────────────────┘
                 ↑ ↑ ↑ ↑ ↑ ↑ ↑
                 │ │ │ │ │ │ │
┌──────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│@ais/ │ │@ais/     │ │@ais/     │ │@ais/     │ │@ais/     │ │@ais/     │
│  db  │ │analysis  │ │ai-engine │ │matching  │ │counseling│ │ report   │
└──┬───┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
   │          │            │            │            │            │
   └──────────┴────────────┴────────────┴────────────┴────────────┘
                              ↑
                    ┌─────────────────┐
                    │    apps/web     │ (모든 패키지 사용)
                    └─────────────────┘
```

### 3.2 의존성 매트릭스

| 패키지 | 의존 가능 | 절대 의존 불가 |
|--------|----------|--------------|
| `@ais/shared` | 없음 | - |
| `@ais/ui` | `@ais/shared` | `@ais/db`, 서버 코드 |
| `@ais/db` | `@ais/shared` | ai-engine, analysis, matching |
| `@ais/analysis` | `@ais/shared` | `@ais/db`, `@ais/ai-engine` |
| `@ais/ai-engine` | `@ais/shared`, `@ais/db` | analysis, matching |
| `@ais/matching` | `@ais/shared`, `@ais/db`, `@ais/analysis` | ai-engine |
| `@ais/counseling` | `@ais/shared`, `@ais/db` | analysis, matching |
| `@ais/report` | `@ais/shared`, `@ais/db` | ai-engine 직접 호출 |
| `apps/web` | **모든 패키지** | - |

### 3.3 핵심 원칙

1. **얇은 앱, 두꺼운 패키지**: `apps/web`은 라우팅·레이아웃·오케스트레이션만 담당
2. **단일 DB**: PostgreSQL 하나를 `@ais/db`가 소유
3. **순수 로직 분리**: `@ais/analysis`는 DB·AI 의존성 없는 순수 계산만
4. **AI 엔진 독립**: `@ais/ai-engine`은 비즈니스 로직 없이 LLM 호출만

---

## 4. 데이터 흐름

### 4.1 요청 흐름 예시: "학생 사주 분석 실행"

```
1. 사용자 클릭 → apps/web Server Action 호출
2. Server Action (오케스트레이터):
   ├─ @ais/db → 학생 정보 조회
   ├─ @ais/analysis/saju → 사주 계산 (순수 로직)
   ├─ @ais/ai-engine → Claude API 호출 (해석 생성)
   ├─ @ais/db → 분석 결과 저장
   └─ 클라이언트에 결과 반환
```

### 4.2 요청 흐름 예시: "교사-학생 매칭 실행"

```
1. 사용자 요청 → apps/web Server Action 호출
2. Server Action:
   ├─ @ais/db → 학생/교사 + 기존 분석 데이터 조회
   ├─ @ais/analysis/compatibility → 호환성 점수 계산
   ├─ @ais/matching → 최적 배치 알고리즘 실행
   ├─ @ais/db → 결과 저장
   └─ 클라이언트에 결과 반환
```

### 4.3 요청 흐름 예시: "상담 AI 요약"

```
1. 사용자가 상담 내용 입력
2. Server Action:
   ├─ @ais/db → 상담 세션 저장
   ├─ @ais/counseling → 상담 데이터 가공
   ├─ @ais/ai-engine → Claude 호출 (AI 요약)
   ├─ @ais/db → AI 요약 저장
   └─ 결과 반환
```

---

## 5. AI 자율 관리 시스템

### 5.1 아키텍처 개요

```
┌────────────────────────────────────────────────────────┐
│ GitHub Actions + Claude Code (AI Autopilot)             │
│                                                          │
│ ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│ │ 1. 감시     │→ │ 2. 진단      │→ │ 3. 수정·배포  │  │
│ │ (Monitor)   │  │ (Diagnose)   │  │ (Fix·Deploy)  │  │
│ └─────────────┘  └──────────────┘  └───────────────┘  │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 4. 주간 보고서 (Weekly Report → Email)               │ │
│ └─────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

### 5.2 자동화 워크플로우

| 워크플로우 | 트리거 | 동작 | 사람 개입 |
|-----------|--------|------|----------|
| **CI/CD** | PR, Push | 린트 → 테스트 → 빌드 → 배포 | 없음 |
| **코드 리뷰** | PR 생성 | Claude 리뷰 → 승인/거부 | 없음 |
| **의존성 업데이트** | 주 1회 | Renovate + Claude 검증 → 자동 머지 | 없음 |
| **보안 스캔** | 일 1회 | npm audit + Claude 분석 → 자동 패치 | High 이상 알림 |
| **에러 모니터링** | Sentry webhook | 에러 분석 → 수정 PR → 배포 | 주간 보고서 |
| **성능 모니터링** | 일 1회 | 메트릭 분석 → 최적화 PR | 주간 보고서 |
| **주간 보고서** | 매주 월요일 | 활동 요약 → 이메일 발송 | 읽기만 |

### 5.3 안전장치 (Guardrails)

| 안전장치 | 설명 |
|---------|------|
| **스테이징 우선** | 모든 변경은 staging 브랜치에 먼저 배포, 헬스체크 후 production |
| **자동 롤백** | 배포 후 5분 내 에러율 증가 시 자동 롤백 |
| **변경 범위 제한** | AI 단일 PR: 최대 10 파일, 500줄 |
| **핵심 파일 보호** | schema.prisma, docker-compose.yml, .env는 AI 수정 불가 |
| **긴급 중단** | `/autopilot stop` 명령으로 즉시 중단 |

---

## 6. Turborepo 파이프라인 설계

### 6.1 turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["tsconfig.base.json"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "test:e2e": {
      "dependsOn": ["build"]
    },
    "db:generate": {
      "cache": false
    },
    "db:push": {
      "cache": false
    },
    "db:seed": {
      "cache": false
    },
    "typecheck": {
      "dependsOn": ["^build"]
    }
  }
}
```

### 6.2 pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

---

## 7. Docker 배포 설계

### 7.1 docker-compose.yml

```yaml
version: "3.8"

services:
  web:
    build:
      context: .
      dockerfile: docker/Dockerfile.web
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://...
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: afterschool
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5435:5432"

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6382:6379"

  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data

volumes:
  postgres_data:
  redis_data:
  caddy_data:
```

---

## 8. 마이그레이션 전략

### 8.1 단계별 마이그레이션

```
Phase 0: Monorepo 기반 구축 (1-2일)
├─ Turborepo + pnpm workspace 설정
├─ tsconfig.base.json 공유 설정
├─ 빈 패키지 스캐폴딩
└─ CI/CD 파이프라인 구축

Phase 1: @ais/shared 추출 (1일)
├─ 타입 정의 이동
├─ Zod 스키마 이동
├─ 유틸리티 함수 이동
└─ 상수 이동

Phase 2: @ais/db 추출 (1-2일)
├─ Prisma 스키마 이동
├─ PrismaClient 싱글톤
├─ 시드 데이터 이동
└─ 리포지토리 패턴 도입

Phase 3: @ais/ui 추출 (1일)
├─ Radix UI 래퍼 이동
├─ 공통 컴포넌트 이동
└─ Storybook 설정 (선택)

Phase 4: @ais/analysis 추출 (2-3일)
├─ 사주 계산 로직 이동 (가장 복잡)
├─ 성명학, MBTI, VARK 이동
├─ 호환성 계산 이동
├─ 단위 테스트 이동 및 보강
└─ 순수 함수 보장 (DB/AI 의존성 제거)

Phase 5: @ais/ai-engine 추출 (2-3일)
├─ 모든 LLM 어댑터 이동
├─ 유니버설 라우터 이동
├─ 프롬프트 이동
├─ 사용량 추적 이동
└─ API 키 암호화 이동

Phase 6: @ais/matching 추출 (1-2일)
├─ 자동 배치 알고리즘 이동
├─ 팀 구성 분석 이동
└─ 공정성 지표 이동

Phase 7: @ais/counseling 추출 (1일)
├─ 상담 세션 로직 이동
├─ 예약 관리 이동
├─ 만족도 조사 이동
└─ AI 요약 로직 이동

Phase 8: @ais/report 추출 (1일)
├─ PDF 생성 로직 이동
├─ 템플릿 이동
└─ 폰트/스타일 이동

Phase 9: apps/web 슬림화 (2-3일)
├─ Server Actions를 얇은 오케스트레이션으로 리팩토링
├─ @ais/* 패키지 import로 교체
├─ 불필요한 코드 제거
└─ E2E 테스트 전체 통과 확인

Phase 10: AI 자동화 구축 (3-5일)
├─ GitHub Actions CI/CD
├─ Claude Code 리뷰 봇
├─ 의존성 자동 업데이트
├─ 에러 모니터링 연동
├─ 자동 롤백 메커니즘
└─ 주간 보고서 시스템
```

### 8.2 예상 소요 기간

| Phase | 작업 | 기간 |
|-------|------|------|
| 0 | Monorepo 기반 | 1-2일 |
| 1-3 | shared, db, ui | 3-4일 |
| 4-5 | analysis, ai-engine | 4-6일 |
| 6-8 | matching, counseling, report | 3-5일 |
| 9 | web 슬림화 | 2-3일 |
| 10 | AI 자동화 | 3-5일 |
| **합계** | | **약 16-25일** |

---

## 9. 기술 스택

| 영역 | 기술 |
|------|------|
| **Monorepo** | Turborepo 2.x + pnpm workspace |
| **Frontend** | Next.js 15, React 19, TypeScript 5 |
| **UI** | Tailwind CSS 4, Radix UI |
| **ORM** | Prisma 7.x |
| **DB** | PostgreSQL 16 |
| **Cache** | Redis 7 |
| **AI** | Anthropic Claude + 12 others |
| **테스트** | Vitest (단위), Playwright (E2E) |
| **CI/CD** | GitHub Actions |
| **배포** | Docker Compose on 192.168.0.5 |
| **리버스 프록시** | Caddy 2 |
| **모니터링** | Sentry, 커스텀 헬스체크 |

---

## 10. 성공 기준

- [ ] 모든 8개 패키지가 독립적으로 빌드·테스트 가능
- [ ] `apps/web`이 모든 패키지를 조합하여 기존 기능 100% 동작
- [ ] E2E 테스트 전체 통과 (기존 ~55개 케이스)
- [ ] Docker Compose로 192.168.0.5에 성공적 배포
- [ ] AI 자동화 파이프라인 동작 확인 (CI/CD + 코드 리뷰)
- [ ] Turborepo 캐시로 빌드 시간 50% 이상 단축
- [ ] `@ais/analysis`가 DB·AI 의존성 없이 순수 로직으로 동작

---

## 부록: 12개 도메인 → 8개 패키지 매핑

| 원본 도메인 | 대상 패키지 | 비고 |
|------------|------------|------|
| 인증 & 계정 | `apps/web` + `@ais/db` | Next.js 내장 (NextAuth) |
| 학생 관리 | `apps/web` + `@ais/db` | CRUD는 앱 레벨 |
| 교사 관리 | `apps/web` + `@ais/db` | CRUD는 앱 레벨 |
| 팀 관리 | `apps/web` + `@ais/db` | CRUD는 앱 레벨 |
| 성향 분석 | **`@ais/analysis`** + `@ais/ai-engine` | 핵심 분리 대상 |
| 매칭 & 호환성 | **`@ais/matching`** | 독립 알고리즘 |
| 상담 관리 | **`@ais/counseling`** | 독립 도메인 |
| 보고서 생성 | **`@ais/report`** | 독립 기능 |
| AI & LLM 관리 | **`@ais/ai-engine`** | 핵심 분리 대상 |
| 채팅 | `apps/web` | 앱 레벨 유지 |
| 이슈 추적 | `apps/web` | 앱 레벨 유지 |
| 관리자 기능 | `apps/web` | 앱 레벨 유지 |
