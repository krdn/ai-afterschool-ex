#!/usr/bin/env bash
# 독립 GitHub 레포 일괄 생성 스크립트
# 사용법: bash scripts/setup-mirror-repos.sh
#
# 사전 요구사항:
#   - gh CLI 인증 완료 (gh auth status)
#   - krdn 조직/계정에 레포 생성 권한

set -euo pipefail

OWNER="krdn"
MONOREPO_URL="https://github.com/krdn/ai-afterschool-ex"

# 패키지명 → 독립 레포명 → 설명 매핑
declare -A REPOS=(
  ["shared"]="ais-shared|공유 타입, 유틸리티, 상수, Zod 검증 — AI AfterSchool monorepo mirror"
  ["db"]="ais-db|Prisma 데이터베이스 클라이언트 — AI AfterSchool monorepo mirror"
  ["ui"]="ais-ui|공통 UI 컴포넌트 (React) — AI AfterSchool monorepo mirror"
  ["analysis"]="ais-analysis|사주/MBTI/VARK/궁합 분석 알고리즘 — AI AfterSchool monorepo mirror"
  ["ai-engine"]="ais-ai-engine|LLM 어댑터, 프롬프트 라우터 — AI AfterSchool monorepo mirror"
  ["matching"]="ais-matching|학생-선생 매칭 알고리즘 — AI AfterSchool monorepo mirror"
  ["counseling"]="ais-counseling|상담 보고서 관리 — AI AfterSchool monorepo mirror"
  ["report"]="ais-report|PDF 리포트 생성 — AI AfterSchool monorepo mirror"
)

TOPICS="ai-afterschool,monorepo-mirror,typescript"

echo "=== AI AfterSchool 독립 레포 생성 ==="
echo ""

# gh CLI 인증 확인
if ! gh auth status &>/dev/null; then
  echo "ERROR: gh CLI 인증이 필요합니다. 'gh auth login'을 실행하세요."
  exit 1
fi

created=0
skipped=0

for pkg in shared db ui analysis ai-engine matching counseling report; do
  IFS='|' read -r repo_name description <<< "${REPOS[$pkg]}"
  full_name="${OWNER}/${repo_name}"

  echo "--- ${full_name} ---"

  # 이미 존재하는 레포는 skip
  if gh repo view "${full_name}" &>/dev/null; then
    echo "  SKIP: 이미 존재합니다."
    skipped=$((skipped + 1))
    continue
  fi

  # 레포 생성 (public, MIT → BSD-3-Clause는 LICENSE 파일로 관리)
  gh repo create "${full_name}" \
    --public \
    --description "${description}" \
    --clone=false

  # 토픽 태그 설정
  gh repo edit "${full_name}" --add-topic "${TOPICS}"

  # README.md 초기 커밋
  readme_content="# ${repo_name}

${description%%—*}

> This repository is an automated mirror of [\`packages/${pkg}\`](${MONOREPO_URL}/tree/main/packages/${pkg}) from the [AI AfterSchool monorepo](${MONOREPO_URL}).
>
> **Do not submit PRs here.** All development happens in the monorepo.

## License

BSD-3-Clause — see [LICENSE](./LICENSE)
"

  gh api "repos/${full_name}/contents/README.md" \
    --method PUT \
    -f message="chore: 초기 README 생성 (monorepo mirror)" \
    -f content="$(echo -n "${readme_content}" | base64 -w0)" \
    --silent

  echo "  CREATED"
  created=$((created + 1))
done

echo ""
echo "=== 완료: ${created}개 생성, ${skipped}개 skip ==="
echo ""
echo "다음 단계:"
echo "  1. GitHub Settings > Fine-grained PAT 생성 (ais-* 레포 대상, Contents write)"
echo "  2. monorepo Settings > Secrets에 MIRROR_TOKEN 등록"
echo "  3. gh workflow run mirror-packages.yml -f force_all=true"
