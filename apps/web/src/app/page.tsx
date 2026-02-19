import { PACKAGE_NAME } from "@ais/shared";

export default function Home() {
  return (
    <main>
      <h1>AI AfterSchool</h1>
      <p>Monorepo 구축 완료 - shared 패키지 연결: {PACKAGE_NAME}</p>
    </main>
  );
}
