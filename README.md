# AI AfterSchool

AI 기반 학원 관리 시스템 - Turborepo Monorepo

## 패키지 구조

```
apps/
  web/          # Next.js 15 웹 애플리케이션
packages/
  shared/       # 공유 타입, 유틸리티, 상수
  db/           # Prisma 데이터베이스 클라이언트
  ui/           # 공통 UI 컴포넌트
  analysis/     # 분석 로직 (사주, 성명학, MBTI, VARK 등)
  ai-engine/    # AI 어댑터, 라우터, 프롬프트
  matching/     # 학생-선생 매칭 알고리즘
  counseling/   # 상담 관리
  report/       # 리포트 생성
```

## 시작하기

```bash
# 의존성 설치
pnpm install

# 전체 빌드
pnpm build

# 개발 서버
pnpm dev

# 테스트
pnpm test

# 타입 체크
pnpm typecheck
```

## 기술 스택

- **Runtime**: Node.js 24+
- **Package Manager**: pnpm 10
- **Monorepo**: Turborepo 2
- **Framework**: Next.js 15
- **Language**: TypeScript 5
- **Build**: tsup (패키지), Next.js (앱)
